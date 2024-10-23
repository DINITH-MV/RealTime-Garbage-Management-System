"use client";

import { WastePickup } from '@prisma/client';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DriverDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [allPickups, setAllPickups] = useState<WastePickup[]>([]);
  const [filteredPickups, setFilteredPickups] = useState<WastePickup[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchAllPickupDetails();
  }, []);

  const fetchAllPickupDetails = () => {
    const apiUrl = '/api/WastePickups';

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: WastePickup[]) => {
        console.log('Fetched Waste Pickups:', data); // Log the fetched data
        setAllPickups(data);
        setFilteredPickups(data);
        updateCounts(data);
      })
      .catch((err) => {
        console.error('Error fetching pickups:', err);
      });
  };

  useEffect(() => {
    if (selectedDate) {
      filterPickupsByDate(selectedDate);
    }
  }, [selectedDate]);

  const filterPickupsByDate = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const filtered = Array.isArray(allPickups) ? allPickups.filter(pickup => pickup.date?.toISOString().split('T')[0] === formattedDate) : [];
    setFilteredPickups(filtered);
    updateCounts(filtered);
  };

  const updateCounts = (data: WastePickup[]) => {
    const completed = data.filter(pickup => pickup.Status === 'Completed').length;
    const pending = data.filter(pickup => pickup.Status === 'Pending').length;

    setCompletedCount(completed);
    setPendingCount(pending);
  };

  return (
    <div className="driver-dashboard flex p-5 bg-gray-100 rounded-lg shadow-md">
      <div className="date-picker mr-5">
        <label htmlFor="date" className="block text-lg font-medium mb-2">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy/MM/dd"
          id="date"
          inline
          className="border border-blue-400 rounded-lg shadow-sm p-2"
        />
      </div>

      <div className="flex-grow">
        <div className="pickup-stats mb-5">
          <h3 className="text-xl font-semibold">Today's Waste Pickup Stats</h3>
          <p className="text-lg">Completed Pickups: <span className="font-bold">{completedCount}</span></p>
          <p className="text-lg">Pending Pickups: <span className="font-bold">{pendingCount}</span></p>
        </div>

        <div className="upcoming-pickups">
          <h3 className="text-xl font-semibold">Upcoming Waste Pickups</h3>
          {filteredPickups.length > 0 ? (
            <ul className="list-disc pl-5 mt-2">
              {filteredPickups.map((pickup) => (
                <li key={pickup.id} className="text-lg">
                  {pickup.date?.toISOString().split('T')[0]} - {pickup.Status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">No upcoming pickups found for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
