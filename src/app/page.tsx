import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { UserCard } from "./user-card";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session?.user ? (
        <div className="flex flex-col items-center justify-center">
          <UserCard user={session.user} />
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
