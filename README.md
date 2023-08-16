# Inngest & Resend for Customer Lifecycle Emails

The purpose of this example is to show you how to get started sending customer lifecycle emails with [Resend](https://resend.com/) and [Inngest](https://inngest.com/).

Resend is a modern email service provider that play nicely with React components.

Inngest is a platform for easily scheduling queues, background jobs, and workflows.

If you get stuck, join the [Inngest Discord](https://www.inngest.com/discord) and we'll help you out!

## How it works

Before we get into the technical details, it's important to understand the whats occurring in this example.

This is a relatively simple (😅) Next.js app that includes a connection to a database via Prisma, authentication using NextAuth, and a simple page to demonstrate functionality.

When a new user joins the site for the first time, we will send them a welcome email. If they don't perform a specific action within a certain time period, we will send them a follow up email.

### Beyond the basics

This is meant to be a starting point for you to build your own application. You can use this as a starting point to build your own application, or you can use it as a reference to add functionality to your existing application.

## Setup

This example uses [next-auth](https://next-auth.js.org/) for authentication and [prisma](https://www.prisma.io/) for database access. The project is configured with GitHub for authentication and a Postgres database by default.

### Database

`next-auth` can be configured with [many different databases and adapters](https://next-auth.js.org/adapters). For this example, we are using Postgres via Prisma. You can find the configuration in `prisma/schema.prisma`.

A quick way to get postgres up and running is using [Neon](https://neon.tech/), which has a free tier and provides you with a URL that you can use to connect to your database by adding it to the `DATABASE_URL` env var.

Technically the database is optional, but it's more useful to explore the example with a database in place. ALternatives to Neon include services like Heroku or similar that allow you to create a Postgres database.

### GitHub OAuth

You'll need to setup a GitHub OAuth app to use this example. You can do that [here](https://github.com/settings/developers) for a personal account using `http://localhost:3000/api/auth/callback/github` as the callback URL by default. If you are configuring a different `localhost` port, you'll need to update the callback URL accordingly. Check [here for the GitHub provider configuration options](https://next-auth.js.org/providers/github).

[`next-auth` supports **many** providers](https://next-auth.js.org/providers/), so if you'd like to explore more options to suit your needs.

### Inngest

Inngest is a platform for easily scheduling queues, background jobs, and workflows in your applications. 

Inngest makes distributed systems easy to build and maintain and takes the pain out of scheduling jobs and workflows by managing all of the associated infrastructure for you.

You can create a free account [here](https://inngest.com/).

In this example we are using Inngest to schedule a job to send a follow up email to users who have not performed a specific action within a certain time period.

To get started, you will run the local Inngest Dev Server:

```shell
npx inngest-cli@latest dev
```

This starts the dev server, which will automatically find the Next.js application and allow you to test your jobs locally.

The standard configuration for Inngest is to serve an API route at `/api/inngest` and in this application you can find that by navigating to `/src/app/api/inngest/route.ts` where the route is defined and exported.

```typescript
export const { GET, POST, PUT } = serve(inngest, [
  userCreated,
]);
```

The `{ GET, POST, PUT }` are the HTTP methods that Inngest will respond to. The `serve` function takes an array of functions that you want to expose to Inngest. In this case, we are exposing just one function: `userCreated`.

```typescript
export const userCreated = inngest.createFunction(
  { name: "A User Was Created" },
  { event: "user/created" },
  async ({ event, step }) => {
    const { email } = event.user;

    await step.run("send-welcome-email", async () => {
      return sendEmail({
        to: email,
        subject: "Welcome to our app!",
        body: "<p>Thanks for signing up!</p>",
      });
    });

    const completedAction = await step.waitForEvent("user/created.document", {
      timeout: "1m",
      if: "event.user.email == async.user.email",
    });

    if (!completedAction) {
      await step.run("send-nudge-email", async () => {
        return sendEmail({
          to: email,
          subject: "How can we help!",
          body: "<p>What can we do better? We are always here to help you suceed.</p>",
        });
      });
    } else {
      await step.run("send-congrats-email", async () => {
        return sendEmail({
          to: email,
          subject: "You did it!",
          body: "<p>We are so glad figured it out! It's challenging to do anything in this rough and tumble world so congrats on that.</p>",
        });
      });
    }
  }
);
```

The `userCreated` function is a multi-step function that performs several actions.

* Sends the user a welcome email
* Waits 1 minute for the user to perform a specific action
* If the user performs the action, sends a congratulations email
* If the user does not perform the action, sends a nudge email



Those functions are both located in `/src/inngest/functions`. Feel free to add your own functions but **remember to add any functions you create to the array that is passed to `serve`** so that Inngest can find them!

👋 Inngest functions have to be added to the array passed to `serve` in order for Inngest to find them.

The other important thing to be able to locate is the Inngest client which is located in `/src/inngest/inngest.client.ts`. This is imported where you want to send events to Inngest.

👋 Inngest is 100% server-side and is not imported for use in the browser!

In this example we import the client in two places.

The first is our simple form located `/src/app/page.tsx` where it is used in a Next.js server action to send an event when a button is pushed. This is the action that we are waiting for the user to perform in order to send the follow up email.

```typescript
async function handleButtonOne() {
  "use server";
  await inngest.send({
    name: "user/email.reaction",
    user: session?.user,
    data: {},
  });
}
```

The other event is dispatched from the NextAuth config in the `createdUser` callback that library provide located in `/src/server/auth.ts`:

```typescript
events: {
  /**
   * 👋 Internally next-auth creates event hooks to handle any application
   * side effects that need to happen when an event occurs
   * in our case we want to send an event to inngest when a user is created
   * so that we can track user signups and other user related events.
   * @see https://next-auth.js.org/configuration/events#createuser
   * @param param0
   */
  createUser: async ({ user }) => {
    inngest.send({ name: "user/created", user, data: {} });
  },
},
```

This creates a complete workflow that reacts to the creation of a new user by sending them a welcome email and waits for a period of time to send a follow up if they don't perform a specific action OR sends them a congrats email if they do perform the action.

Simple, but powerful!

### Sending Emails with Resend

Resend makes it relatively easy to get started sending emails. You can create a free account [here](https://resend.com/).

To send emails, you'll also need to [verify a sending domain with Resend using DNS](https://resend.com/domains). This is a simple process that will allow you to send emails from your domain. It's required because Resend is built to send transactional emails.

## Deploy the Application

Before you deploy you'll need to add the following environment variables to your deployment:

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `DATABASE_URL`
- `INNGEST_EVENT_KEY`
- `INNGEST_SIGNING_KEY`
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `NEXTAUTH_SECRET`

You can get the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from your GitHub OAuth app. The `DATABASE_URL` is the URL to your Postgres database. The `NEXTAUTH_SECRET` is a random string that you can generate with `openssl rand -hex 32`.

The `INNGEST_EVENT_KEY` and the `INNGEST_SIGNING_KEY` can be found in the Inngest cloud dashboard for your application or applied to your application via the Inngest Vercel integration.

👋 [Details on deploying your Inngest application to production can be found here](https://www.inngest.com/docs/deploy)

The `RESEND_API_KEY` is the API key that you can find in the Resend dashboard for your application.

The `FROM_EMAIL` is the email addresses that you want to send emails from and reply to. Note that this has to be verified with Resend if you use that service.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjoelhooks%2Finngest-resend-example%2Ftree%2Fmain&env=INNGEST_EVENT_KEY,INNGEST_SIGNING_KEY,RESEND_API_KEY,GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET,DATABASE_URL,NEXTAUTH_SECRET,FROM_EMAIL&project-name=inngest-resend-example&repository-name=inngest-resend-example)

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com/)
- [Resend](https://resend.com/)
- [Inngest](https://inngest.com/)

## About the Stack

This is based on the [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

It's had some changes to migrate to the Next.js 13 App Router.
