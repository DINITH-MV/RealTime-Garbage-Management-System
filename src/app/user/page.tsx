import Analytics from "@/components/Dashboard/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { redirect } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import { checkRole } from '@/utils/roles'
import ManagementAppointment from "@/components/Settings/AppointmentManagement/ManageAppointment";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManagementDashboard",
};

export default async function User() {

  const isAdmin = checkRole('admin'); // Perform role check server-side

  const { userId } = await auth();

  if (!userId ) {
    return redirect("/auth/sign-in");
  }


  return (
    <DefaultLayout isAdmin={isAdmin}>
      <ManagementAppointment userId={userId}/>
    </DefaultLayout>
  );
}
