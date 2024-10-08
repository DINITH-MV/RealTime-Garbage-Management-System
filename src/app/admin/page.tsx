import Analytics from "@/components/Dashboard/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import getAllLocations from "../../../actions/get-locations";
import { checkRole } from '@/utils/roles'

export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManagementDashboard",
};

export default async function User() {
  const formattedLocations = await getAllLocations();

  // Get userId from Clerk using getAuth (Server-side check)
  const { userId } = auth();

  // console.log(userId);

  if (!checkRole('admin')) {
    return redirect("/not-authorized"); // You could have a 'not authorized' page  }
  }
  // Conditionally render the page based on whether the user is an admin
  return (
    <DefaultLayout>
      <Analytics locations={formattedLocations} />
    </DefaultLayout>
  );
}
