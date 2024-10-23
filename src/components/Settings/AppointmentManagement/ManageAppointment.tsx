"use client";

// Define the Appointment interface
interface Appointment {
  id: string;
  location: string;
  type: string;
  description: string;
  date?: string;
  paymentStatus?: string; // Add this line
}

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// ManagementAppointment Component
export default function ViewAppointment() {
  const [Appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState(false); // Add this state to trigger refresh

  // Fetch Appointments from the API
  const getAppointments = async () => {
    try {
      const res = await fetch("/api/Appointments", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch Appointments");
      }

      const data = await res.json();
      setAppointments(data.Appointments || []);
    } catch (error) {
      console.error("Error loading Appointments: ", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Appointments when the component mounts
  useEffect(() => {
    getAppointments();
  }, [shouldRefresh]);

  // Function to handle deleting a Appointment

  if (loading) {
    return (
      <p className="text-gray-600 text-center text-lg font-semibold">
        Loading...
      </p>
    );
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-12">
      <h5 className="text-xl font-semibold text-black dark:text-white">
            Customer Appointments
          </h5>
      <div className="mt-6 mb-10 ">
        {Appointments.length === 0 ? (
          <p className="text-gray-600 text-center text-lg font-semibold">
            No Appointments available.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Appointments.map((t) => (
              <div
                key={t.id}
                className="border-gray-300 flex flex-col justify-between gap-4 rounded-lg border-[2px] border-white bg-[#fbeabb] p-4 shadow-lg"
              >
                <div>
                  <div className="flex justify-between">
                    <h2 className="text-gray-800 text-[17pt] font-bold">
                      {t.type}
                    </h2>
                    <p className="text-gray-600 mt-[5px] text-[13pt]">
                      Payment:
                      <span className="text-[#ea3636]"> {t.paymentStatus}</span>
                    </p>
                  </div>
                  <p className="text-gray-600 mt-[10px] text-[13pt]">
                    Location: {t.location}
                  </p>
                  <p className="text-gray-600 mt-[5px] text-[13pt]">
                    Due Date:
                    {t.date
                      ? new Date(t.date).toLocaleDateString()
                      : "Date not available"}
                  </p>
                  <p className="text-gray-600 mt-[5px] text-[13pt]">
                    Type: {t.type}
                  </p>
                  <p className="text-gray-600 mt-[5px] text-[13pt]">
                    Description: {t.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}