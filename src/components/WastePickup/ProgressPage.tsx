"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

export interface FeedbackType {
  id: number;               
  aid: number;              
  location: string;        
  type: string;             
  date: Date | string | null; 
  driver: string;          
  Feedback: string;        
}

export interface AppointmentType {
  id: number;               
  location: string;        
  type: string;             
  description: string;     
  date: Date | string | null; 
  paymentStatus: string;   
}

const ProgressPage = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoadingFeedbacks(true);
      try {
        const res = await fetch('/api/Feedbacks');
        if (!res.ok) {
          console.error(`Error fetching feedbacks: ${res.statusText}`);
          throw new Error('Failed to fetch feedbacks');
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : { feedbacks: [] };

        console.log('Fetched feedbacks:', data);  
        setFeedbacks(data.feedbacks);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        toast.error('Error fetching feedbacks');
      } finally {
        setLoadingFeedbacks(false);
      }
    };

    const getAppointments = async () => {
      setLoadingAppointments(true);
      try {
        const res = await fetch("/api/Appointments", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch Appointments");
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : { Appointments: [] };

        setAppointments(data.Appointments || []);
      } catch (error) {
        console.error("Error loading Appointments: ", error);
        setAppointments([]); 
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchFeedbacks();
    getAppointments();
  }, []);

  const formatDate = (date: Date | string | null): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    const isoString = dateObj.toISOString();
    return isoString.split('T')[0];
  };

  if (loadingFeedbacks || loadingAppointments) {
    return <div className="text-center">Loading data...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  // Filter feedbacks based on matching appointment IDs
  const matchingFeedbacks = feedbacks.filter(feedback => 
    appointments.some(appointment => appointment.id === feedback.aid)
  );

  return (
    <div className="p-4">
     
  

      
      <h2 className="text-lg font-semibold mb-4"> Feedbacks to Appointments</h2>
      <table className="min-w-full leading-normal">
        <thead className="bg-[#15752e] text-[#f5fbf0] dark:bg-[#174312]">
          <tr className="border-gray-200 border-b dark:border-[#1a4e17] dark:bg-[#23621c] dark:text-[#fff]">
            <th className="border border-gray-300 p-2">Driver</th>
            <th className="border border-gray-300 p-2">Location</th>
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Feedback</th>
          </tr>
        </thead>
        <tbody>
          {matchingFeedbacks.length > 0 ? (
            matchingFeedbacks.map((feedback) => {
              const appointment = appointments.find(app => app.id === feedback.aid);
              return (
                <tr key={feedback.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{feedback.driver}</td>               
                  <td className="border border-gray-300 p-2">{appointment ? appointment.location : 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{appointment ? appointment.type : 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{feedback.Feedback}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center">No matching feedbacks found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProgressPage;
