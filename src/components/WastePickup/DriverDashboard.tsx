"use client";

import { WastePickup } from '@prisma/client';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DriverDashboard = () => {
  const [wastePickups, setWastePickups] = useState<WastePickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());


  const getWastePickups = async () => {
    try {
      const res = await fetch("/api/WastePickups", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch WastePickups");
      }

      const data = await res.json();
      setWastePickups(data.wastePickups || []);
    } catch (error) {
      console.error("Error loading WastePickups: ", error);
      setWastePickups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWastePickups();
  }, []);

  // Filter waste pickups based on the selected date
  const filteredPickups = wastePickups.filter((pickup) => {
    if (!selectedDate) return true;
    const pickupDate = new Date(pickup.date);
    return (
      pickupDate.getFullYear() === selectedDate.getFullYear() &&
      pickupDate.getMonth() === selectedDate.getMonth() &&
      pickupDate.getDate() === selectedDate.getDate()
    );
  });

 
  const statusCountsToday = {
    inProgress: filteredPickups.filter((pickup) => pickup.Status === "In Progress").length,
    completed: filteredPickups.filter((pickup) => pickup.Status === "Completed").length,
    pending: filteredPickups.filter((pickup) => pickup.Status === "Pending").length,
    total: filteredPickups.length,
  };


  const statusCountsTotal = {
    inProgress: wastePickups.filter((pickup) => pickup.Status === "In Progress").length,
    completed: wastePickups.filter((pickup) => pickup.Status === "Completed").length,
    pending: wastePickups.filter((pickup) => pickup.Status === "Pending").length,
    total: wastePickups.length,
  };

  const pieDataToday = {
    labels: ['In Progress', 'Completed', 'Pending'],
    datasets: [
      {
        label: 'Today\'s Status',
        data: [
          statusCountsToday.inProgress,
          statusCountsToday.completed,
          statusCountsToday.pending,
        ],
        backgroundColor: ['#f39c12', '#27ae60', '#f1c40f'],
        hoverBackgroundColor: ['#e67e22', '#2ecc71', '#f39c12'],
      },
    ],
  };

  const pieDataTotal = {
    labels: ['In Progress', 'Completed', 'Pending'],
    datasets: [
      {
        label: 'Total Status',
        data: [
          statusCountsTotal.inProgress,
          statusCountsTotal.completed,
          statusCountsTotal.pending,
        ],
        backgroundColor: ['#3498db', '#1abc9c', '#e74c3c'],
        hoverBackgroundColor: ['#2980b9', '#16a085', '#c0392b'],
      },
    ],
  };

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
        Waste Pickups
      </h5>

     
      <div className="flex flex-col md:flex-row justify-between">
        {/* DatePicker component for filtering */}
        <div className="md:w-1/3 my-4">
          <label className="block mb-2 font-semibold">Filter by Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            isClearable
            placeholderText="Select a date"
            inline
            className="bg-green-100 rounded-lg p-4 border-2 border-green-700 text-green-700 font-bold"
            todayButton="Today"
            wrapperClassName="mt-4"
          />
        </div>

        {/* Pie Chart for Date Statuses */}
        <div className="md:w-1/3 my-4 flex flex-col items-center">
          <h6 className="font-semibold text-center">Date Status</h6>
          <div style={{ width: '300px', height: '300px' }}>
            <Pie data={pieDataToday} />
          </div>
          <p className="mt-2 font-semibold text-gray-600">
            Total Pickups of Date: {statusCountsToday.total}
          </p>
          <div className="flex justify-around mt-2">
  <p className="text-sm text-[#f39c12]">In Progress: {statusCountsToday.inProgress}</p>
  <p className="text-sm text-[#27ae60] ml-2">Completed: {statusCountsToday.completed}</p>
  <p className="text-sm text-[#f1c40f] ml-2">Pending: {statusCountsToday.pending}</p>
</div>
        </div>

        {/* Pie Chart for Total Statuses */}
        <div className="md:w-1/3 my-4 flex flex-col items-center ">
          <h6 className="font-semibold text-center">Total Status</h6>
          <div style={{ width: '300px', height: '300px' }}>
            <Pie data={pieDataTotal} />
          </div>
          <p className="mt-2 font-semibold text-gray-600  p-1">
            Total Pickups Overall: {statusCountsTotal.total}
          </p><div className="flex justify-around mt-2">
          <p className="text-sm text-[#3498db]">In Progress: {statusCountsTotal.inProgress}</p>
          <p className="text-sm text-[#1abc9c] ml-2">Completed: {statusCountsTotal.completed}</p>
          <p className="text-sm text-[#e74c3c] ml-2">Pending: {statusCountsTotal.pending}</p>
        </div></div>
      </div>

      {/* Waste pickup table */}
      <div className="md:w-full overflow-x-auto mt-6">
        <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
          <table className="min-w-full leading-normal">
            <thead className="bg-[#15752e] text-[#f5fbf0] dark:bg-[#174312]">
              <tr>
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPickups.map((pickup) => (
                <tr key={pickup.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pickup.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pickup.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pickup.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(pickup.date))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pickup.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
