import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Example usage in Next.js (server-side)
export default async function Home() {
    const { userId } = auth(); // Get userId from Clerk or another auth service

    if (!userId) {
        return redirect("/auth/sign-in");
    }

    if (checkRole("admin")) {
      redirect("/admin");
    } else if (checkRole("driver")) {
      redirect("/driver");
    } else {
      redirect("/user");
    }
}
