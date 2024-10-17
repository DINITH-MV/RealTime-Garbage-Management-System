import Analytics from "@/components/Dashboard/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import getAllLocations from "../../../actions/get-locations";
import { checkRole } from '@/utils/roles'
import ManagementAppointment from "@/components/Settings/AppointmentManagement/ManageAppointment";

export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManagementDashboard",
};

export default async function User() {

  const { userId } = auth();

  const isAdmin = checkRole('admin'); // Perform role check server-side

  if (!userId ) {
    return redirect("/auth/sign-in");
  }

  return (
    <DefaultLayout isAdmin={isAdmin}>
      <ManagementAppointment/>
    </DefaultLayout>
  );
}
