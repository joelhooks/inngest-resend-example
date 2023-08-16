import { Inngest, EventSchemas } from "inngest";
import { type UserEmailReaction } from "@/inngest/functions/user-email-reaction";
import { UserCreated } from "./functions/user-created";

export const inngest = new Inngest({
  name: "Resend Example",
  schemas: new EventSchemas().fromUnion<UserEmailReaction | UserCreated>(),
});
