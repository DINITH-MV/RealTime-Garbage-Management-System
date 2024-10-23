"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ViewWastePickup from "./ViewDriverAssign";

// Define types for Appointment and WastePickup
type AppointmentData = {
  id: string;
  location: string;
  type: string;
  description: string;
  date: string; // Using string for date; you can parse it as needed
  paymentStatus: string; // Add this line
};

type WastePickupData = {
  id: string;
  apid: string;
  location: string;
  type: string;
  description: string;
  date: string;
  driver: string;
  Status: string;
};

const DriverAssign: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [wastePickups, setWastePickups] = useState<WastePickupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [currentPickup, setCurrentPickup] = useState<AppointmentData | null>(null);
  const drivers = [
    { id: 1, name: 'Driver 1' },
    { id: 2, name: 'Driver 2' },
    { id: 3, name: 'Driver 3' },
  ];

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
      // Filter out only completed appointments
      const completedAppointments = data.Appointments?.filter(
        (appointment: AppointmentData) => appointment.paymentStatus === "completed"
      ) || [];
      setAppointments(completedAppointments);
    } catch (error) {
      console.error("Error loading Appointments: ", error);
      setAppointments([]);
    }
  };
  

  
  const getWastePickups = async () => {
    try {
      const res = await fetch("/api/WastePickups", {
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch WastePickups");
      }
  
      const data = await res.json();
      console.log(data); // Check if the data is as expected
      setWastePickups(data.wastePickups || []); // Ensure this is called with the correct data
    } catch (error) {
      console.error("Error loading WastePickups: ", error);
      setWastePickups([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch both Appointments and WastePickups on component mount
  useEffect(() => {
    getAppointments();
    getWastePickups();
  }, []);

  
  // Function to handle assigning a driver to a selected appointment
  const handleAssignDriver = async (appointment: AppointmentData) => {
    try {
      const response = await axios.post(`/api/WastePickups`, {
        apid: appointment.id,
        location: appointment.location,
        type: appointment.type,
        description: appointment.description,
        date: appointment.date,
        driver: selectedDriver,
        Status: selectedStatus,
      });

      if (response.status === 201) {
        toast.success("Driver assigned successfully!");
        // Refresh WastePickups after insertion
        getWastePickups();
      } else {
        toast.error("Failed to assign driver");
      }
    } catch (error) {
      console.error("Error assigning driver:", error);
      toast.error("Something went wrong.");
    }
  };

  // Filter appointments based on the search term
  // Filter appointments based on the search term and exclude ones present in WastePickups
  const filteredAppointments = appointments.filter(
    (appointment) =>
      // Check if the appointment id exists in wastePickups.apid
      !wastePickups.some((pickup) => pickup.apid === appointment.id) &&
      // Filter based on search term
      (appointment.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  return (
    <div>
      <Breadcrumb pageName="Waste Pickup Management" />
      <div className="font-sans bg-gray-200 antialiased">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="py-8">
            <div>
              <h2 className="text-2xl font-semibold leading-tight">
                Waste Pickup Management
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
                        Driver
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
                        <td className="border-gray-200 max-w-[120px] border-b px-5 py-5 text-[14pt]">
                          <p className="text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                            {appointment.id}
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
                            {new Date(appointment.date).toLocaleString()}
                          </p>
                        </td>
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                        <select
                        value={selectedDriver}
                        onChange={(e) => setSelectedDriver(e.target.value)}
                        className="border-gray-400 bg-white rounded-[7px] p-2"
                      >
                        <option value="">Select Driver</option>
                        <option value=""> Driver 1</option>
                        <option value=""> Driver 2</option>
                        <option value=""> Driver 3</option>
                        
                      </select>
        </td>
     
                        <td className="border-gray-200 border-b px-5 py-5 text-[14pt]">
                          <button
                            onClick={() => {
                              setCurrentPickup(appointment);
                              handleAssignDriver(appointment);
                            }}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Assign Driver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h2 className="text-2xl font-semibold leading-tight mt-4">
              Waste Pickup Table
            </h2>

           <div>
           <ViewWastePickup/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAssign;