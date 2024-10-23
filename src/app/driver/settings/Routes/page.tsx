import Analytics from "@/components/Dashboard/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import { checkRole } from '@/utils/roles'
import ManagementAppointment from "@/components/Settings/AppointmentManagement/ManageAppointment";
import Route from "@/components/Settings/Route/route";

export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManagementDashboard",
};

export default async function User() {

  const { userId } = auth();

  const isAdmin = checkRole('admin'); 

  if (!userId ) {
    return redirect("/auth/sign-in");
  }

  console.log(isAdmin)

  return (
    <DefaultLayout isAdmin={isAdmin}>
      <Route/>
    </DefaultLayout>
  );
}
