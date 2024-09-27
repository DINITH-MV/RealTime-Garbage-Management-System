import Analytics from "@/components/Dashboard/Analytics";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "RealTime Garbage Management System",
  description: "This is Next.js Home for GarbageManageDashboard",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Analytics />
      </DefaultLayout>
    </>
  );
}
