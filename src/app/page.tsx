import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { UserCard } from "./user-card";
import { Button } from "@/components/ui/button";
import { inngest } from "../inngest/inngest.client";

export default async function Home() {
  const session = await getServerSession(authOptions);
  async function handleButtonOne() {
    "use server";
    await inngest.send({
      name: "user/email.reaction",
      user: session?.user,
      data: {
        message: "Hello World",
      },
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session?.user ? (
        <div className="flex flex-col items-center justify-center">
          <UserCard user={session.user}>
            <div className="p-3">
              <form action={handleButtonOne}>
                <Button>Create a Document</Button>
              </form>
            </div>
          </UserCard>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Link
            href="/api/auth/signin"
            className="text-2xl font-bold text-gray-800 hover:text-gray-700"
          >
            Sign in
          </Link>
        </div>
      )}
    </main>
  );
}
