import Analytics from "@/components/Dashboard/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "../../lib/db";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManageDashboard",
};

type LocationData = {
  id: string;
  city: string;
  apiUrl: string;
  marker: string;
  latitude: number;
  longitude: number;
  createdAt: string;
};

export default async function Home() {
  const LOCATION = await db.location.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Format the createdAt field to a string
  const formattedLocations: LocationData[] = LOCATION.map((location) => ({
    id: location.id,
    city: location.city,
    apiUrl: location.apiUrl,
    marker: location.marker,
    latitude: location.latitude,
    longitude: location.longitude,
    createdAt: format(location.createdAt, "yyyy-MM-dd HH:mm:ss"),
  }));

  return (
    <>
      <DefaultLayout>
        <Analytics locations={formattedLocations}/>
      </DefaultLayout>
    </>
  );
}
