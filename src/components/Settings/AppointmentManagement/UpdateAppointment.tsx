"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditTopicFormProps {
  id: string;
  location: string;
  type: string;
  description: string;
  date: string;
}

export default function EditTopicForm({ id, location, type, description, date }: EditTopicFormProps) {
  const [newLocation, setNewLocation] = useState(location);
  const [newType, setNewType] = useState(type);
  const [newDescription, setNewDescription] = useState(description);
  const [newDate, setNewDate] = useState(date ? new Date(date).toISOString().split("T")[0] : "");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(id)

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

      if (!res.ok) {
        throw new Error("Failed to update topic");
      }

      router.refresh();
      router.push("/"); // Redirect to home after updating
    } catch (error) {
      console.error("Error updating topic:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Location Field */}
      <input
        onChange={(e) => setNewLocation(e.target.value)}
        value={newLocation}
        className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-600"
        type="text"
        placeholder="Location"
        required
      />

      {/* Type Field */}
      <input
        onChange={(e) => setNewType(e.target.value)}
        value={newType}
        className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-600"
        type="text"
        placeholder="Type (e.g., Paper, Polythene)"
        required
      />

      {/* Description Field */}
      <input
        onChange={(e) => setNewDescription(e.target.value)}
        value={newDescription}
        className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-600"
        type="text"
        placeholder="Description"
        required
      />

      {/* Date Field */}
      <input
        onChange={(e) => setNewDate(e.target.value)}
        value={newDate}
        className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-600"
        type="date"
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
      >
        Update Topic
      </button>
    </form>
  );
}
