"use client";
import React, { useState, useEffect } from "react";

interface CardDetails {
  id: number;
  cardNumber: string;
  ownerName: string;
  cvc: string;
  expDate: string; // Assuming the date comes in as an ISO string from the backend
  createdAt: string;
}

const PaymentCardManagement = () => {
  const [cardDetails, setCardDetails] = useState<CardDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<CardDetails | null>(null); // Selected card for update or delete
  const [ownerName, setOwnerName] = useState<string>("");
  const [cvc, setCvc] = useState<string>("");
  const [expDate, setExpDate] = useState<string>("");

  // Function to fetch payment card details from the API
  const getPaymentCardDetails = async () => {
    try {
      setLoading(true);
      setError(""); // Reset error before fetching

      const res = await fetch("/api/Payment", {
        cache: "no-store", // Ensure the request is not cached
      });

      if (!res.ok) {
        throw new Error("Failed to fetch Payment Card Details");
      }

      const data = await res.json();

      // Ensure the response contains an array
      if (!Array.isArray(data.PaymentCardDetails)) {
        throw new Error("Invalid data format received from API");
      }

      setCardDetails(data.PaymentCardDetails); // Set the fetched card details
    } catch (error) {
      console.error("Error loading Payment Card Details: ", error);
      setError((error as Error).message || "Failed to load payment card details.");
    } finally {
      setLoading(false); // End the loading state
    }
  };

  // Fetch card details when the component mounts
  useEffect(() => {
    getPaymentCardDetails();
  }, []);

  // Function to handle card update
  const handleUpdate = (card: CardDetails) => {
    setSelectedCard(card);
    setOwnerName(card.ownerName);
    setCvc(card.cvc);
    setExpDate(new Date(card.expDate).toISOString().substring(0, 10)); // Set formatted date in the input
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const res = await fetch(`/api/Payment/${selectedCard?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerName,
          cvc,
          expDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update card");
      }

      setCardDetails((prev) =>
        prev.map((card) =>
          card.id === selectedCard?.id
            ? { ...card, ownerName, cvc, expDate }
            : card
        )
      );
      setShowUpdateModal(false); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating card:", error);
    }
  };

  // Function to handle card deletion
  const handleDelete = (card: CardDetails) => {
    setSelectedCard(card);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`/api/Payment/${selectedCard?.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete card");
      }

      setCardDetails((prev) =>
        prev.filter((card) => card.id !== selectedCard?.id)
      );
      setShowDeleteModal(false); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  // Conditional rendering based on loading or error state
  if (loading) {
    return <div>Loading payment card details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Payment Card Details</h1>
      {cardDetails.length === 0 ? (
        <p>No payment card details available.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Cardholder</th>
              <th className="border border-gray-300 px-4 py-2">Card Number</th>
              <th className="border border-gray-300 px-4 py-2">CVC</th>
              <th className="border border-gray-300 px-4 py-2">Expiry Date</th>
              <th className="border border-gray-300 px-4 py-2">Created At</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cardDetails
            .map((card) => (
              <tr key={card.id}>
                <td className="border border-gray-300 px-4 py-2">{card.ownerName}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {card.cardNumber.replace(/\d{12}(\d{4})/, "************$1")}
                </td>
                <td className="border border-gray-300 px-4 py-2">{card.cvc}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(card.expDate).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(card.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleUpdate(card)}
                  >
                    Update
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 text-red ml-2"
                    onClick={() => handleDelete(card)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Update Card Details</h2>
            <label className="block mb-2">
              Cardholder Name:
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              CVC:
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </label>
            <label className="block mb-2">
              Expiry Date:
              <input
                type="date"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </label>
            <div className="flex justify-center mt-4">
              <button
                className="bg-green-600 text-black px-4 py-2 rounded mr-2"
                onClick={handleUpdateSubmit}
              >
                Save
              </button>
              <button
                className="bg-gray-600 text-black px-4 py-2 rounded"
                onClick={() => setShowUpdateModal(false)} // Close modal on cancel
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this card?
            </h2>
            <div className="flex justify-end">
              <button
                className="bg-red-600 text-red px-4 py-2 rounded mr-2"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
              <button
                className="bg-gray-600 text-black px-4 py-2 rounded"
                onClick={() => setShowDeleteModal(false)} // Close modal on cancel
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCardManagement;
