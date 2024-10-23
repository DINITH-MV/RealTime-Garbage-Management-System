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

export default async function Admin() {
  const formattedLocations = await getAllLocations();

  const isAdmin = checkRole('admin'); 
  const isDriver = checkRole('driver'); 
  

  if (!checkRole('admin')) {
      redirect('/403'); 
    }
  
  return (
    <DefaultLayout isAdmin={isAdmin} isDriver={isDriver}>
      <Analytics locations={formattedLocations} />
    </DefaultLayout>
  );
}
