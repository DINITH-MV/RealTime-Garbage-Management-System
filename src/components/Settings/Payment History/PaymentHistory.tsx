"use client";

import React, { useEffect, useState } from "react";

// Interface for each payment history item
interface PaymentHistoryItem {
  id: number;
  cardNumber: string;
  cvc: string;
  expDate: string;
  ownerName: string;
  balance: number;
  history: string;
  createdAt: string;
}

const PaymentHistory: React.FC = () => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Function to fetch payment history
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

      setPaymentHistory(data.PaymentCardDetails); // Set the fetched card details
    } catch (error) {
      console.error("Error loading Payment Card Details: ", error);
      setError(
        (error as Error).message || "Failed to load payment card details.",
      );
    } finally {
      setLoading(false); // End the loading state
    }
  };

  // Fetch payment history when the component is mounted
  useEffect(() => {
    getPaymentCardDetails();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-6 text-center text-3xl font-bold">Payment History</h2>

      {loading && (
        <p className="text-center text-lg">Loading payment history...</p>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {paymentHistory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden rounded-lg bg-[#e9e9e9] shadow-lg">
            <thead className="bg-gray-800 border-b text-black">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Card Number</th>
                <th className="px-6 py-3 text-left">CVC</th>
                <th className="px-11 py-3 text-left">Expiry Date</th>
                <th className="px-6 py-3 text-left">Owner Name</th>
                <th className="px-6 py-3 text-left">Balance</th>
                <th className="px-6 py-3 text-left">History</th>
                <th className="px-6 py-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory
                .sort((a, b) => a.id - b.id) // Sorting by id in ascending order
                .map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-6 py-3">{item.id}</td>
                    <td className="px-6 py-3">{item.cardNumber.replace(/\d{12}(\d{4})/, "************$1")}</td>
                    <td className="px-6 py-3">{item.cvc}</td>
                    <td className="px-6 py-3">{item.expDate}</td>
                    <td className="px-6 py-3">{item.ownerName}</td>
                    <td className="px-3 py-3">Rs: {item.balance} </td>
                    <td className="px-6 py-3">{item.history}</td>
                    <td className="px-6 py-3">{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <p className="text-center text-lg">No payment history available.</p>
        )
      )}
    </div>
  );
};

export default PaymentHistory;
