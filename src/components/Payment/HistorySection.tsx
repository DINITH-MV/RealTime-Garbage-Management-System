// HistorySection.tsx
import React from "react";

interface PaymentHistoryItem {
  date: string;
  amount: number;
  method: string;
}

interface HistorySectionProps {
  paymentHistory: PaymentHistoryItem[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ paymentHistory }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>
      {paymentHistory.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Method</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{item.date}</td>
                <td className="py-2 px-4 border-b">{item.amount} RS</td>
                <td className="py-2 px-4 border-b">{item.method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payment history available.</p>
      )}
    </div>
  );
};

export default HistorySection;
