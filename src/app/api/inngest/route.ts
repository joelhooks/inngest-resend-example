import { serve } from "inngest/next";
import { inngest } from "@/inngest/inngest.client";
import { userCreated } from "@/inngest/functions/user-created";

export const { GET, POST, PUT } = serve(inngest, [userCreated]);
