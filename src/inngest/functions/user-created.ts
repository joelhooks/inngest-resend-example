import { EventPayload } from "inngest";
import { inngest } from "@/inngest/inngest.client";
import { Resend } from "resend";
import { env } from "@/env.mjs";

export type UserCreated = EventPayload & {
  name: "user/created";
  data?: any;
};

export type UserCreatedDocument = EventPayload & {
  name: "user/created.document";
  data: {
    email: string;
  };
};

function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const resend = new Resend(env.RESEND_API_KEY);
  return resend.emails.send({
    from: env.FROM_EMAIL,
    ...(env.REPLY_TO_EMAIL && { replyTo: env.REPLY_TO_EMAIL }), // optional (defaults to from
    to,
    subject,
    html: body,
  });
}

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
