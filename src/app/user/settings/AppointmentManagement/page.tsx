import Analytics from "@/components/Dashboard/Analytics";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { checkRole } from "@/utils/roles";
import ManagementAppointment from "@/components/Settings/AppointmentManagement/ManageAppointment";

export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManagementDashboard",
};

export default async function Settings() {
  const isAdmin = checkRole("admin"); // Perform role check server-side

  const { userId } = await auth();
  
  return (
    <>
      <DefaultLayout isAdmin={isAdmin}>
        <ManagementAppointment userId={userId}/>
      </DefaultLayout>
    </>
  );
}
