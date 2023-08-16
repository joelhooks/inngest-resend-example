import { EventPayload } from "inngest";
import { inngest } from "@/inngest/inngest.client";
import { Resend } from "resend";
import { env } from "@/env.mjs";

export type UserCreated = EventPayload & {
  name: "user/created";
  data?: any;
};

export const userCreated = inngest.createFunction(
  { name: "A User Was Created" },
  { event: "user/created" },
  async ({ event, step }) => {
    await step.run("send-welcome-email", async () => {
      const resend = new Resend(env.RESEND_API_KEY);
      const { email } = event.user;
      return resend.emails.send({
        from: env.FROM_EMAIL,
        ...(env.REPLY_TO_EMAIL && { replyTo: env.REPLY_TO_EMAIL }), // optional (defaults to from
        to: email,
        subject: "Congrats on Pushing a Button",
        html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
      });
    });
  }
);
