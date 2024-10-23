"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Define Appointment data type
type AppointmentData = {
  id: string;
  userId: string;
  location: string;
  type: string;
  description: string;
  date: string;
  paymentStatus: string;
};

const ManageRequests: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentAppointment, setCurrentAppointment] =
    useState<AppointmentData | null>(null); // Used for updating

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

  // Fetch appointments on component mount
  useEffect(() => {
    getAppointments();
  }, []);

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.paymentStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      "",
  );

  const [paymentStatus, setPaymentStatus] = useState("");

  // Function to handle updating payment status
  const handleUpdatePaymentStatus = async (id: string, newStatus: string) => {
    try {
      const response = await axios.patch(`/api/Appointments/${id}`, {
        paymentStatus: newStatus,
      });

      if (response.status === 200) {
        // Update the appointment list with the new payment status
        setAppointments((prevList) =>
          prevList.map((appointment) =>
            appointment.id === id
              ? { ...appointment, paymentStatus: newStatus }
              : appointment,
          ),
        );
        toast.success("Payment status updated!");
      } else {
        toast.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Something went wrong.");
    }
  };

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <div>
      <Breadcrumb pageName="Appointments Management" />
      <div className="font-sans bg-gray-200 antialiased">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="py-8">
            <div>
              <h2 className="text-2xl font-semibold leading-tight">
                Appointments
              </h2>
            </div>
            <div className="my-2 flex w-full flex-col sm:flex-row">
              <div className="relative block">
                <span className="absolute inset-y-0 left-0 flex h-full items-center pl-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="text-gray-500 h-4 w-4 fill-current dark:text-[#fff]"
                  >
                    <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-400 text-gray-700 placeholder-gray-400 focus:placeholder-gray-600 focus:text-gray-700 block w-full rounded-[7px] border bg-white py-2 pl-8 pr-6 text-[14pt] focus:bg-white focus:outline-none dark:bg-[#23621c] dark:text-white placeholder:dark:text-[#fff]"
                />
              </div>
            </div>

            <div className="-mx-4 overflow-x-auto px-4 py-4 sm:-mx-8 sm:px-8">
              <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
                <table className="min-w-full leading-normal">
                  <thead className="bg-[#15752e] text-[#f5fbf0] dark:bg-[#174312]">
                    <tr>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3 text-left font-semibold uppercase tracking-wider">
                        ID
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3 text-left font-semibold uppercase tracking-wider">
                        Location
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3 text-left font-semibold uppercase tracking-wider">
                        Type
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3 text-left font-semibold uppercase tracking-wider">
                        Description
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3 text-left font-semibold uppercase tracking-wider">
                        Date
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3 text-left font-semibold uppercase tracking-wider">
                        Payment Status
                      </th>
                      <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3 text-left font-semibold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-gray-200 border-b dark:border-[#1a4e17] dark:bg-[#23621c] dark:text-[#fff]"
                      >
                        <td className="border-gray-200 max-w-[140px] border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900  overflow-hidden text-ellipsis whitespace-nowrap">
                            {appointment.userId}
                          </p>
                        </td>
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {appointment.location}
                          </p>
                        </td>
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {appointment.type}
                          </p>
                        </td>
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {appointment.description}
                          </p>
                        </td>
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {new Date(appointment.date).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {appointment.paymentStatus}
                          </p>
                        </td>
                        <td className="border-gray-200 flex px-5 py-5 text-[14pt]">
                          <select
                            value={appointment.paymentStatus}
                            onChange={(e) =>
                              handleUpdatePaymentStatus(
                                appointment.id,
                                e.target.value,
                              )
                            }
                            className="rounded-[7px] border px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex items-center justify-between bg-[#15752e] px-5 py-5 text-[#f5fbf0] dark:border-[#1a4e17] dark:bg-[#1d5517] dark:text-[#fff]">
                  <span className="text-gray-900 text-xs sm:text-sm">
                    {`Showing ${filteredAppointments.length} of ${appointments.length} Entries`}{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRequests;
