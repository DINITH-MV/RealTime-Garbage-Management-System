"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Define the WastePickup interface
interface WastePickup {
  id: number; // Changed to number for Int type
  apid: number; // Changed to number to match the model
  location: string;
  type: string;
  description: string;
  date?: string; // Optional
  driver: string; // New field
  Status: string; // Changed from Status to lowercase
}

// ManagementWastePickup Component
export default function ViewWastePickup() {
  const [wastePickups, setWastePickups] = useState<WastePickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldRefresh, setShouldRefresh] = useState(false); // State to trigger refresh
  const router = useRouter();
  const [currentPickup, setCurrentPickup] = useState<WastePickup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch WastePickups from the API
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

  // Fetch WastePickups when the component mounts
  useEffect(() => {
    getWastePickups();
  }, [shouldRefresh]);

  const handleEditClick = (pickup: WastePickup) => {
    setCurrentPickup(pickup);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pickup?");
    if (confirmDelete) {
      try {
        const res = await fetch(`/api/WastePickups/${id}`, { method: "DELETE" });

        if (!res.ok) {
          throw new Error("Failed to delete WastePickup");
        }

        setShouldRefresh((prev) => !prev);
        toast.success("Pickup deleted successfully!"); // Show toast on successful delete
      } catch (error) {
        console.error("Error deleting WastePickup: ", error);
        toast.error("Error deleting WastePickup."); // Show error toast
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentPickup(null);
  };

  const handlePickupUpdate = async (updatedPickup: WastePickup) => {
    if (updatedPickup.id !== null) {
      try {
        const res = await fetch(`/api/WastePickups/${updatedPickup.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPickup), // Send entire pickup object
        });

        if (!res.ok) {
          throw new Error("Failed to update WastePickup");
        }

        setShouldRefresh((prev) => !prev); // Refresh the list after updating
        toast.success("Pickup updated successfully!"); // Show toast on successful update
      } catch (error) {
        console.error("Error updating WastePickup: ", error);
        toast.error("Error updating WastePickup."); // Show error toast
      }
    }
  };

// EditDialog Component
interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedPickup: WastePickup) => void; // Update type for submission
  currentPickup: WastePickup | null; // Pass the current pickup object
}

const EditDialog: React.FC<EditDialogProps> = ({ isOpen, onClose, onSubmit, currentPickup }) => {
  const [updatedPickup, setUpdatedPickup] = useState<WastePickup | null>(currentPickup);

  useEffect(() => {
    setUpdatedPickup(currentPickup);
  }, [currentPickup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedPickup) {
      onSubmit(updatedPickup);
      onClose();
    }
  };

  if (!isOpen || !updatedPickup) return null; // Don't render if dialog is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <h2 className="text-lg font-semibold">Edit Waste Pickup</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            
            <input
              type="hidden"
              value={updatedPickup.location}
              onChange={(e) => setUpdatedPickup({ ...updatedPickup, location: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            
            <input
              type="hidden"
              value={updatedPickup.type}
              onChange={(e) => setUpdatedPickup({ ...updatedPickup, type: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
           
            <input
              type="hidden"
              value={updatedPickup.description}
              onChange={(e) => setUpdatedPickup({ ...updatedPickup, description: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            
            <input
              type="hidden"
              value={updatedPickup.date?.split("T")[0]} // Format date
              onChange={(e) => setUpdatedPickup({ ...updatedPickup, date: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Driver</label>
            <select
              value={updatedPickup.driver}
              onChange={(e) => setUpdatedPickup({ ...updatedPickup, driver: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Driver1">Driver1</option>
              <option value=" Driver2">Driver2</option>
              <option value="Driver3">Driver3</option>
            </select>
          </div>
          <div className="mb-4">
         
            <input
              type="hidden"
              value={updatedPickup.Status}
              onChange={(e) => setUpdatedPickup({ ...updatedPickup, Status: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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
                Driver
              </th>
              <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3 text-left font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="bg-gray-100 border-gray-200 text-gray-600 border-b-2 px-5 py-3 text-left font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
          {wastePickups.map((pickup) => (
              <tr key={pickup.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pickup.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pickup.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pickup.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pickup.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pickup.driver}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pickup.Status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {pickup.Status !== "In Progress" && pickup.Status !== "Completed" ? (
          <div className="flex space-x-2">
            {/* Edit Button */}
            <button
              onClick={() => handleEditClick(pickup)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
            {/* Delete Button */}
            <button
              onClick={() => handleDelete(pickup.id)}
              className="bg-red text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ) : (
          <span className="text-gray-400">Already Started</span> // Disabled actions text
        )}
      </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handlePickupUpdate}
        currentPickup={currentPickup}
      />
    </div>
  );
}
