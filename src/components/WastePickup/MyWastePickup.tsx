"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import Link from "next/link";
import FeedbackDialog from "./FeedbackList";

// Define the structure for the WastePickup interface
interface WastePickup {
  apid: number;
  id: number;
  location: string;
  type: string;
  description: string;
  date?: string;
  driver: string;
  Status: string;
}

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
              value={updatedPickup.driver}
              onChange={(e) => setUpdatedPickup({ ...updatedPickup, driver: e.target.value })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 p-3">Status</label>
            <div>
              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  value="Pending"
                  checked={updatedPickup.Status === 'Pending'}
                  onChange={(e) => setUpdatedPickup({ ...updatedPickup, Status: e.target.value })}
                  style={{ display: 'none' }}
                />
                <span
                  style={{
                    padding: '10px 20px',
                    backgroundColor: updatedPickup.Status === 'Pending' ? '#4F46E5' : '#E5E7EB',
                    color: updatedPickup.Status === 'Pending' ? 'white' : 'black',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    border: '1px solid #4F46E5',
                    marginRight: '5px',
                  }}
                >
                  Pending
                </span>
              </label>

              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  value="In Progress"
                  checked={updatedPickup.Status === 'In Progress'}
                  onChange={(e) => setUpdatedPickup({ ...updatedPickup, Status: e.target.value })}
                  style={{ display: 'none' }}
                />
                <span
                  style={{
                    padding: '10px 20px',
                    backgroundColor: updatedPickup.Status === 'In Progress' ? '#4F46E5' : '#E5E7EB',
                    color: updatedPickup.Status === 'In Progress' ? 'white' : 'black',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    border: '1px solid #4F46E5',
                    marginRight: '5px',
                  }}
                >
                  In Progress
                </span>
              </label>

              <label>
                <input
                  type="radio"
                  value="Completed"
                  checked={updatedPickup.Status === 'Completed'}
                  onChange={(e) => setUpdatedPickup({ ...updatedPickup, Status: e.target.value })}
                  style={{ display: 'none' }}
                />
                <span
                  style={{
                    padding: '10px 20px',
                    backgroundColor: updatedPickup.Status === 'Completed' ? '#4F46E5' : '#E5E7EB',
                    color: updatedPickup.Status === 'Completed' ? 'white' : 'black',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    border: '1px solid #4F46E5',
                  }}
                >
                  Completed
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 bg-rose-700 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Update
            </button>
          </div>
        </form>
      </div>
      <div>
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
          <div className="flex justify-end">
           
          </div>
        </form>
      </div>
    </div>
  );
};

// Main ViewWastePickup Component
export default function ViewWastePickup() {
  const [wastePickups, setWastePickups] = useState<WastePickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPickup, setCurrentPickup] = useState<WastePickup | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<string>(""); 
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    aid: 0,
    location: '',
    type: '',
    date: '',
    driver: '',
    feedback: ''
  });
  const getWastePickups = async () => {
    try {
      const res = await fetch("/api/WastePickups", { cache: "no-store" });

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
          throw new Error("Failed to delete pickup");
        }

        toast.success("Pickup deleted successfully"); // Show success toast
        setShouldRefresh((prev) => !prev);
      } catch (error) {
        console.error("Error deleting pickup:", error);
        toast.error("Failed to delete pickup"); // Show error toast
      }
    }
  };


  const handleSubmitDialog = async (updatedPickup: WastePickup) => {
    try {
      const res = await fetch(`/api/WastePickups/${updatedPickup.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedPickup),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update pickup");
      }

      toast.success("Pickup updated successfully"); // Show success toast
      setShouldRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error updating pickup:", error);
      toast.error("Failed to update pickup"); // Show error toast
    }
  };

  const handleOpenFeedbackDialog = (pickup: WastePickup) => {
    setFeedbackData({
      aid: pickup.apid, // Assuming apid corresponds to aid in your feedback model
      location: pickup.location,
      type: pickup.type,
      date: pickup.date || '',
      driver: pickup.driver,
      feedback: ''
    });
    setIsFeedbackDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentPickup(null);
  };

  const handleFeedbackDialogClose = () => {
    setIsFeedbackDialogOpen(false);
    setFeedbackData({ aid: 0, location: '', type: '', date: '', driver: '', feedback: '' });
  };
  const router = useRouter(); 
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/Feedbacks", {
      method: "POST",
      body: JSON.stringify(feedbackData), // Ensure feedbackData is structured correctly
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parse the response
    const responseData = await res.json(); 

    // Check if the response status is 201 (Created)
    if (res.status === 201) {
      toast.success("Feedback submitted successfully!");
      handleFeedbackDialogClose(); // Close the dialog
      setShouldRefresh((prev) => !prev); // Trigger refresh of data
      router.push('/driver'); 
    } else {
      // Handle error responses
      throw new Error(responseData.message || "Failed to submit feedback");
    }
  } catch (error) {
    console.error("Error submitting feedback:", error);
    toast.error("Failed to submit feedback"); // Show error toast
  }
}; 

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold">Waste Pickup Management</h1>
      </div>

      {wastePickups.length === 0 ? (
        <div>No Waste Pickups available.</div>
      ) : (
        <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Driver</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {wastePickups.map((pickup) => (
            <tr key={pickup.id}>
              <td className="border px-4 py-2">{pickup.id}</td>
              <td className="border px-4 py-2">{pickup.location}</td>
              <td className="border px-4 py-2">{pickup.type}</td>
              <td className="border px-4 py-2">{pickup.description}</td>
              <td className="border px-4 py-2">{pickup.date?.split("T")[0]}</td>
              <td className="border px-4 py-2">{pickup.driver}</td>
              <td className="border px-4 py-2">{pickup.Status}</td>
              <td className="border px-4 py-2 flex justify-center">
                <button
                  onClick={() => handleEditClick(pickup)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit
                </button>
                <button
                  onClick={() => handleDelete(pickup.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                  <button onClick={() => handleOpenFeedbackDialog(pickup)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Give Feedback
            </button>
                
              </td>
            </tr>))}
        </tbody></table>)}

        {/* Feedback Dialog */}
      {isFeedbackDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-lg font-semibold">Feedback</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <input type="hidden" value={feedbackData.aid} />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={feedbackData.location}
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  value={feedbackData.type}
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Driver</label>
                <input
                  type="text"
                  value={feedbackData.driver}
                  readOnly
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                <textarea
                  value={feedbackData.feedback}
                  onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={handleFeedbackDialogClose} className="mr-2 bg-rose-700 text-white px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}{isDialogOpen && (
        <EditDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onSubmit={handleSubmitDialog}
          currentPickup={currentPickup}/>
      )}  
    </div>
    
    
  );
}
      
    
