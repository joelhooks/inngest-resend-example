import { Inngest, EventSchemas } from "inngest";
``;
import type {
  UserCreated,
  UserCreatedDocument,
} from "./functions/user-created";

export const inngest = new Inngest({
  name: "Resend Example",
  schemas: new EventSchemas().fromUnion<UserCreatedDocument | UserCreated>(),
});
