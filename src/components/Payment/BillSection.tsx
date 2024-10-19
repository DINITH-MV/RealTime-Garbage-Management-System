// BillSection.tsx
import { useState } from "react";

interface BillSectionProps {
  walletBalance: number;
}

const BillSection: React.FC<BillSectionProps> = ({ walletBalance }) => {
  const [billDetails, setBillDetails] = useState({
    billAmount: 1000, // This should be fetched from backend or context
    payAmount: 1000,
    remainingBalance: 0,
  });

  const downloadPDF = () => {
    // Implement PDF download functionality
    alert("Downloading PDF...");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Payment Bill</h2>
      <p>Bill Amount: {billDetails.billAmount} RS</p>
      <p>Pay Amount: {billDetails.payAmount} RS</p>
      <p>Remaining Balance to be Paid: {billDetails.remainingBalance} RS</p>
      <p>Wallet Savings Amount: {walletBalance} RS</p>
      <button onClick={downloadPDF} className="btn-primary mt-4">
        Download PDF
      </button>
    </div>
  );
};

export default BillSection;
