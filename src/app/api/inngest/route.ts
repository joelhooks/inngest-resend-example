import { serve } from "inngest/next";
import { inngest } from "@/inngest/inngest.client";
import { userEmailReaction } from "@/inngest/functions/user-email-reaction";
import { userCreated } from "@/inngest/functions/user-created";

export const { GET, POST, PUT } = serve(inngest, [
  userEmailReaction,
  userCreated,
]);
