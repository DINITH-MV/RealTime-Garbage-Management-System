import Analytics from "@/components/Dashboard/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getAllLocations from "../../../../../actions/get-locations";
import { checkRole } from "@/utils/roles";
import AreaManagement from "@/components/Settings/AreaManagement/AreaManagement";
import DriverAssign from "@/components/DriverAssign/ManageDriverAssign";

export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManagementDashboard",
};

export default async function Settings() {
  const formattedLocations = await getAllLocations();
  const isAdmin = checkRole("admin"); 

  return (
    <>
      <DefaultLayout isAdmin={isAdmin}>
        <DriverAssign />
      </DefaultLayout>
    </>
  );
}
