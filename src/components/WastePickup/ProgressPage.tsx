"use client";

import { useState, useEffect } from "react";

// Define the interfaces
interface Appointment {
  id: string;
  location: string;
  type: string;
  description: string;
  date?: string;
  paymentStatus?: string;
}

interface WastePickup {
  id: string;
  apid: string;
  location: string;
  type: string;
  description: string;
  date?: string;
  driver: string;
  status: string;
}

interface Feedback {
  id: string;
  aid: string;
  location: string;
  type: string;
  date?: string;
  driver: string;
  feedback: string;
}

export default function ProgressPage() {
  const [Appointments, setAppointments] = useState<Appointment[]>([]);
  const [WastePickups, setWastePickups] = useState<WastePickup[]>([]);
  const [Feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const getAppointmentsData = async () => {
    try {
      const appointmentsRes = await fetch("/api/Appointments", { cache: "no-store" });
      const wastePickupRes = await fetch("/api/WastePickups", { cache: "no-store" });
      const feedbackRes = await fetch("/api/Feedbacks", { cache: "no-store" });
  
      if (!appointmentsRes.ok || !wastePickupRes.ok || !feedbackRes.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const appointmentsData = await appointmentsRes.json();
      const wastePickupData = await wastePickupRes.json();
      const feedbackData = await feedbackRes.json();
  
      console.log('Appointments Data:', appointmentsData);
      console.log('Waste Pickup Data:', wastePickupData);
      console.log('Feedback Data:', feedbackData);
  
      setAppointments(appointmentsData.Appointments || []);
      setWastePickups(wastePickupData.WastePickups || []);
      setFeedbacks(feedbackData.Feedbacks || []);
    } catch (error) {
      console.error("Error loading data: ", error);
      setAppointments([]);
      setWastePickups([]);
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <p className="text-gray-600 text-center text-lg font-semibold">Loading...</p>
    );
  }

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-12">
      <h5 className="text-xl font-semibold text-black dark:text-white">
        Appointment Progress
      </h5>
      <div className="mt-6 mb-10">
        {Appointments.length === 0 ? (
          <p className="text-gray-600 text-center text-lg font-semibold">
            No appointments available.
          </p>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Appointments.map((appointment) => {
              // Find matching WastePickup and Feedback based on apid/aid
              const wastePickup = WastePickups.find((wp) => wp.apid === appointment.id);
              const feedback = Feedbacks.find((fb) => fb.aid === appointment.id);

              return (
                <div
                  key={appointment.id}
                  className="border-gray-300 flex flex-col justify-between gap-4 rounded-lg border-[2px] border-white bg-[#fbeabb] p-4 shadow-lg"
                >
                  <div>
                    <h2 className="text-gray-800 text-[17pt] font-bold">
                      {appointment.type}
                    </h2>
                    <p className="text-gray-600 mt-[10px] text-[13pt]">
                      Location: {appointment.location}
                    </p>
                    <p className="text-gray-600 mt-[5px] text-[13pt]">
                      Date: {appointment.date ? new Date(appointment.date).toLocaleDateString() : "Date not available"}
                    </p>
                    <p className="text-gray-600 mt-[5px] text-[13pt]">
                      Description: {appointment.description}
                    </p>

                    {/* Waste Pickup Details */}
                    {wastePickup ? (
                      <>
                        <h3 className="mt-4 text-gray-800 text-[15pt] font-bold">
                          Waste Pickup Details
                        </h3>
                        <p className="text-gray-600 mt-[5px] text-[13pt]">
                          Driver: {wastePickup.driver}
                        </p>
                        <p className="text-gray-600 mt-[5px] text-[13pt]">
                          Status: {wastePickup.status}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-600 mt-[10px] text-[13pt]">No waste pickup data.</p>
                    )}

                    {/* Feedback Details */}
                    {feedback ? (
                      <>
                        <h3 className="mt-4 text-gray-800 text-[15pt] font-bold">
                          Feedback
                        </h3>
                        <p className="text-gray-600 mt-[5px] text-[13pt]">
                          {feedback.feedback}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-600 mt-[10px] text-[13pt]">No feedback submitted.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
