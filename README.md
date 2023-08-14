# Inngest & Resend for Customer Lifecycle Emails

The purpose of this example is to show you how to get started sending customer lifecycle emails with [Resend](https://resend.com/) and [Inngest](https://inngest.com/).

Resend is a modern email service provider that play nicely with React components.

Inngest is a platform for easily scheduling queues, background jobs, and workflows.

For this example, we will be sending a welcome email when a user signs up for the first time and a follow up email if they don't perform a specific action within a certain time period.

For the sake of demonstration, we will keep it simple! But it should give you a good idea of the potential of setting up a system like this and the things you might do within your own applications.

If you get stuck, join the [Inngest Discord](https://www.inngest.com/discord) and we'll help you out!

## Setup

This example uses [next-auth](https://next-auth.js.org/) for authentication and [prisma](https://www.prisma.io/) for database access. The project is configured with GitHub for authentication and a Postgres database by default.

### Database

`next-auth` can be configured with [many different databases and adapters](https://next-auth.js.org/adapters). For this example, we are using Postgres via Prisma. You can find the configuration in `prisma/schema.prisma`.

A quick way to get postgres up and running is using [Neon](https://neon.tech/), which has a free tier and provides you with a URL that you can use to connect to your database by adding it to the `DATABASE_URL` env var.

Technically the database is optional, but it's more useful to explore the example with a database in place. ALternatives to Neon include services like Heroku or similar that allow you to create a Postgres database.

### GitHub OAuth

You'll need to setup a GitHub OAuth app to use this example. You can do that [here](https://github.com/settings/developers) for a personal account using `http://localhost:3000/api/auth/callback/github` as the callback URL by default. If you are configuring a different `localhost` port, you'll need to update the callback URL accordingly. Check [here for the GitHub provider configuration options](https://next-auth.js.org/providers/github).

[]`next-auth` supports **many** providers](https://next-auth.js.org/providers/), so if you'd like to explore more options to suit your needs.

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
