"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure this is imported


export interface FeedbackType {
  id: number;               
  aid: number;              
  location: string;         
  type: string;             
  date: Date | string | null; 
  driver: string;           
  Feedback: string;         
}

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingFeedback, setEditingFeedback] = useState<FeedbackType | null>(null);
  const [newFeedback, setNewFeedback] = useState<FeedbackType | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/Feedbacks');
        if (!res.ok) {
          throw new Error('Failed to fetch feedbacks');
        }
        const data = await res.json();
        setFeedbacks(data.feedbacks);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        toast.error('Error fetching feedbacks');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
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

  const handleEdit = (feedback: FeedbackType) => {
    setEditingFeedback(feedback);
    setNewFeedback({ ...feedback });
  };

  const handleDelete = async (id: number) => {
    try {
      console.log(`Deleting feedback with id: ${id}`); // Debug log
      const res = await fetch(`/api/Feedbacks/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete feedback');
      }

      setFeedbacks(feedbacks.filter(fb => fb.id !== id));
      toast.success('Feedback deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error deleting feedback');
    }
  };

  const handleSave = async () => {
    if (!newFeedback) return;

    try {
      console.log(`Saving feedback: ${JSON.stringify(newFeedback)}`); // Debug log
      const res = await fetch(`/api/Feedbacks/${newFeedback.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      });

      if (!res.ok) {
        throw new Error('Failed to update feedback');
      }

      const updatedFeedbacks = feedbacks.map(fb =>
        fb.id === newFeedback.id ? newFeedback : fb
      );

      setFeedbacks(updatedFeedbacks);
      setEditingFeedback(null);
      setNewFeedback(null);
      toast.success('Feedback updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Error updating feedback');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!newFeedback) return;

    setNewFeedback({
      ...newFeedback,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="text-center">Loading feedbacks...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Feedback List</h2>
      {editingFeedback ? (
        <div className="mb-4 p-4 border border-gray-300 rounded">
          <h3 className="text-xl mb-2">Edit Feedback</h3>
          <input
            type="hidden"
            name="location"
            value={newFeedback?.location ?? ''}
            onChange={handleChange}
            placeholder="Location"
            className="border border-gray-300 p-2 mb-2 w-full rounded"
          />
          <input
            type="hidden"
            name="type"
            value={newFeedback?.type ?? ''}
            onChange={handleChange}
            placeholder="Type"
            className="border border-gray-300 p-2 mb-2 w-full rounded"
          />
          <input
            type="hidden"
            name="driver"
            value={newFeedback?.driver ?? ''}
            onChange={handleChange}
            placeholder="Driver"
            className="border border-gray-300 p-2 mb-2 w-full rounded"
          />
          <textarea
            name="Feedback"
            value={newFeedback?.Feedback ?? ''}
            onChange={handleChange}
            placeholder="Feedback"
            className="border border-gray-300 p-2 mb-2 w-full rounded"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditingFeedback(null)}
              className="bg-gray-300 p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Pickup ID</th>
              <th className="border border-gray-300 p-2">Location</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Date</th>
              <th className="border border-gray-300 p-2">Driver</th>
              <th className="border border-gray-300 p-2">Feedback</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{feedback.id}</td>
                <td className="border border-gray-300 p-2">{feedback.aid}</td>
                <td className="border border-gray-300 p-2">{feedback.location}</td>
                <td className="border border-gray-300 p-2">{feedback.type}</td>
                <td className="border border-gray-300 p-2">{formatDate(feedback.date)}</td>
                <td className="border border-gray-300 p-2">{feedback.driver}</td>
                <td className="border border-gray-300 p-2">{feedback.Feedback}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleEdit(feedback)}
                    className="bg-yellow-500 text-white p-1 rounded mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeedbackList;
