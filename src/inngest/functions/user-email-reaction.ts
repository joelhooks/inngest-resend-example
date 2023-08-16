import { EventPayload } from "inngest";
import { inngest } from "../inngest.client";
import { Resend } from "resend";
import { env } from "@/env.mjs";

export type UserEmailReaction = EventPayload & {
  name: "user/email.reaction";
  data: {
    email: string;
  };
};

export type UserCreated = EventPayload & {
  name: "user/created";
  data: {
    email: string;
  };
};

export const userEmailReaction = inngest.createFunction(
  { name: "React to a User Action by Sending an Email" },
  { event: "user/email.reaction" },
  async ({ event, step }) => {
    await step.run("send-email", async () => {
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
