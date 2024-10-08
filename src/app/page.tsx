import Analytics from "@/components/Dashboard/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getAllLocations from "../../actions/get-locations";
import Settings from "./admin/settings/AreaManagement/page";
import { auth } from "@clerk/nextjs/server";
import { SignedIn, UserButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManagementDashboard",
};

export default async function Home() {
  const formattedLocations = await getAllLocations();

  // Get userId from Clerk using getAuth (Server-side check)
  const { userId } = auth();

  console.log(userId)

  // Fetch the Admin ID from environment variables
  const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;

  // Conditionally render the page based on whether the user is an admin
  return (
    <DefaultLayout>
      <SignedIn>
            <UserButton />
          </SignedIn>
      {userId === adminId ? (
        <Analytics locations={formattedLocations} />
      ) : (
        "Nothing"
      )}
    </DefaultLayout>
  );
}
