"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddManagement() {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ location?: string; type?: string; date?: string; description?: string }>({});

  const router = useRouter();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!location) newErrors.location = "Location is required.";
    if (!type) newErrors.type = "Type is required.";
    if (!date) newErrors.date = "Date is required.";
    if (!description) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location, type, date, description }),
      });

      if (res.ok) {
        router.refresh(); // Refresh the page to show the new topic
        router.push("/"); // Redirect to homepage after successful creation
      } else {
        throw new Error("Failed to create topic");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Location Field */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="location">
          Location
        </label>
        <input
          id="location"
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
      </div>

      {/* Type Field */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="type">
          Type
        </label>
        <input
          id="type"
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Enter type (e.g., paper, plastic)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        {errors.type && <span className="text-red-500 text-sm">{errors.type}</span>}
      </div>

      {/* Date Field */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          type="date"
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
      </div>

      {/* Description Field */}
      <div className="flex flex-col">
        <label className="text-gray-700 font-semibold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Enter topic description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
      >
        Add Topic
      </button>
    </form>
  );
}
