"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import AddManagement from "./AddAppointment";
import EditTopicForm from "./UpdateAppointment";

interface Topic {
  _id: string;
  type: string;
  location: string;
  date?: string;
  description: string;
}

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
      setTopics([]); // Ensure topics is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch topics when the component mounts
  useEffect(() => {
    getTopics();
  }, []);

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

  // Conditionally render the content
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
              key={t._id}
              className="border-gray-300 flex flex-col justify-between gap-4 rounded-lg border bg-green-50 p-4 shadow-lg"
            >
              {/* Topic Details */}
              <div>
                <h2 className="text-gray-800 text-lg font-bold">{t.type}</h2>
                <p className="text-gray-600 text-sm">Location: {t.location}</p>
                <p className="text-gray-600 mb-2 text-sm">
                  {t.date ? new Date(t.date).toLocaleDateString() : "Date not available"}
                </p>
                <p className="text-gray-600">{t.description}</p>
              </div>

              {/* Edit Button */}
              <button
                className="text-blue-600 font-bold hover:text-blue-800"
                onClick={() => openEditModal(t)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add Topic */}
      <Modal isOpen={isAddModalOpen} onClose={closeModal}>
        <AddManagement />
      </Modal>

      {/* Modal for Edit Topic */}
      {selectedTopic && (
        <Modal isOpen={isEditModalOpen} onClose={closeModal}>
          <EditTopicForm
            id={selectedTopic._id}
            location={selectedTopic.location}
            type={selectedTopic.type}
            description={selectedTopic.description}
            date={selectedTopic.date || ""}
          />
        </Modal>
      )}
    </div>
  );
}
