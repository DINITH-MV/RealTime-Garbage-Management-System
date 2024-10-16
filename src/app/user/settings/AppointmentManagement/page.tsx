import Analytics from "@/components/Dashboard/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getAllLocations from "../../../../../actions/get-locations";
import { checkRole } from "@/utils/roles";
import ManagementAppointment from "@/components/Settings/AppointmentManagement/ManageAppointment";

export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManagementDashboard",
};

export default async function Settings() {
  const isAdmin = checkRole("admin"); // Perform role check server-side

  return (
    <>
      <DefaultLayout isAdmin={isAdmin}>
        <ManagementAppointment />
      </DefaultLayout>
    </>
  );
}
