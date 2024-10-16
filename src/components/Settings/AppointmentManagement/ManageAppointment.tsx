"use client";

// Define the Topic interface
interface Topic {
  id: string;
  location: string;
  type: string;
  description: string;
  date?: string;
}

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

// Add Topic Form (AddManagement)
function AddManagement({ onSubmit }: { onSubmit: () => void }) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location, type, date, description }),
      });

      if (res.ok) {
        onSubmit();
      } else {
        throw new Error("Failed to add topic");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="type">
          Type
        </label>
        <input
          id="type"
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2"
          placeholder="Enter type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          type="date"
          className="border border-gray-300 rounded-md px-4 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="border border-gray-300 rounded-md px-4 py-2"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md"
      >
        Add Topic
      </button>
    </form>
  );
}

// Edit Topic Form (EditTopicForm)
function EditTopicForm({
  id,
  location,
  type,
  description,
  date,
  onSubmit,
}: {
  id: string;
  location: string;
  type: string;
  description: string;
  date: string;
  onSubmit: () => void;
}) {
  const [newLocation, setNewLocation] = useState(location);
  const [newType, setNewType] = useState(type);
  const [newDescription, setNewDescription] = useState(description);
  const [newDate, setNewDate] = useState(
    date ? new Date(date).toISOString().split("T")[0] : ""
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: newLocation,
          type: newType,
          description: newDescription,
          date: newDate,
        }),
      });

      if (res.ok) {
        onSubmit();
      } else {
        throw new Error("Failed to update topic");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="type">
          Type
        </label>
        <input
          id="type"
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          type="date"
          className="border border-gray-300 rounded-md px-4 py-2"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="border border-gray-300 rounded-md px-4 py-2"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md"
      >
        Update Topic
      </button>
    </form>
  );
}

// ManagementAppointment Component
export default function ManagementAppointment() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const router = useRouter();

  // Fetch topics from the API
  const getTopics = async () => {
    try {
      const res = await fetch("/api/topics", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch topics");
      }

      const data = await res.json();
      setTopics(data.topics || []);
    } catch (error) {
      console.error("Error loading topics: ", error);
      setTopics([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch topics when the component mounts
  useEffect(() => {
    getTopics();
  }, []);

  // Function to handle deleting a topic
  const deleteTopic = async (id: string) => {
    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (res.ok) {
        getTopics(); // Refresh the topics after deletion
      } else {
        throw new Error("Failed to delete topic");
      }
    } catch (error) {
      console.error("Error deleting topic: ", error);
    }
  };

  // Handle Add Topic Modal
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Handle Edit Topic Modal
  const openEditModal = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedTopic(null);
  };

  if (loading) {
    return (
      <p className="text-gray-600 text-center text-lg font-semibold">
        Loading...
      </p>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-6xl px-4">
      {/* Button to open Add Topic modal */}
      <button
        onClick={openAddModal}
        className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
      >
        Add Topic
      </button>

      {topics.length === 0 ? (
        <p className="text-gray-600 text-center text-lg font-semibold">
          No topics available.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-5">
          {topics.map((t) => (
            <div
              key={t.id}
              className="border-gray-300 flex flex-col justify-between gap-4 rounded-lg border bg-green-50 p-4 shadow-lg"
            >
              <div>
                <h2 className="text-gray-800 text-lg font-bold">{t.type}</h2>
                <p className="text-gray-600 text-sm">Location: {t.location}</p>
                <p className="text-gray-600 mb-2 text-sm">
                  {t.date ? new Date(t.date).toLocaleDateString() : "Date not available"}
                </p>
                <p className="text-gray-600">{t.description}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  className="text-blue-600 font-bold hover:text-blue-800"
                  onClick={() => openEditModal(t)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 font-bold hover:text-red-800"
                  onClick={() => deleteTopic(t.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add Topic */}
      <Modal isOpen={isAddModalOpen} onClose={closeModal}>
        <AddManagement onSubmit={closeModal} />
      </Modal>

      {/* Modal for Edit Topic */}
      {selectedTopic && (
        <Modal isOpen={isEditModalOpen} onClose={closeModal}>
          <EditTopicForm
            id={selectedTopic.id}
            location={selectedTopic.location}
            type={selectedTopic.type}
            description={selectedTopic.description}
            date={selectedTopic.date || ""}
            onSubmit={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
