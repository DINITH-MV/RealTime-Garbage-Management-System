import Analytics from "@/components/Dashboard/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import getAllLocations from "../../actions/get-locations";


export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManagementDashboard",
};

export default async function Home() {

  const formattedLocations = await getAllLocations();

  return (
    <>
      <DefaultLayout>
        <Analytics locations={formattedLocations}/>
      </DefaultLayout>
    </>
  );
}
