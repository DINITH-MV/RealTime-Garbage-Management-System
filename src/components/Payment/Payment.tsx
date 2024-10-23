// payment.tsx
"use client";
import { useState, useEffect } from "react";
import {
  FaCreditCard,
  FaHistory,
  FaWallet,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import RechargeWallet from "./RechargeWallet";
import PaySection from "./PaySection";
import BillSection from "./BillSection";
import HistorySection from "./HistorySection";
import axios from "axios"; // For making API calls

const PaymentPage = () => {
  const [mode, setMode] = useState<"normal" | "payment">("normal");
  const [activeButton, setActiveButton] = useState<string>("paymentDetails");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  const toggleMode = () => {
    setMode(mode === "normal" ? "payment" : "normal");
    setActiveButton(mode === "normal" ? "rechargeWallet" : "paymentDetails");
  };

  // Fetch wallet balance on component mount
  useEffect(() => {
    const fetchWalletBalance = async () => {
      // try {
      //   const response = await axios.get("/api/wallet-balance"); // Replace with your API endpoint
      //   setWalletBalance(response.data.balance);
      // } catch (error) {
      //   console.error("Error fetching wallet balance:", error);
      // }
    };
    fetchWalletBalance();
  }, []);

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get("/api/payment-history"); // Replace with your API endpoint
      setPaymentHistory(response.data.history);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  // Call fetchPaymentHistory when the 'History' button is clicked
  const handleHistoryClick = () => {
    setActiveButton("history");
    fetchPaymentHistory();
  };

  return (
    <div className="flex h-[85vh] bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        {/* Sidebar Buttons */}
        <div className="p-4">
          {mode === "normal" ? (
            <>
              <button
                onClick={() => setActiveButton("paymentDetails")}
                className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-left ${
                  activeButton === "paymentDetails"
                    ? "bg-[#bfaa20] text-white"
                    : "text-gray-700 hover:bg-gray-200"
                } rounded-lg`}
              >
                <FaCreditCard className="mr-2" />
                Payment Details
              </button>
              <button
                onClick={handleHistoryClick}
                className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-left ${
                  activeButton === "history"
                    ? "bg-[#bfaa20] text-white"
                    : "text-gray-700 hover:bg-gray-200"
                } rounded-lg`}
              >
                <FaHistory className="mr-2" />
                History
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveButton("rechargeWallet")}
                className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-left ${
                  activeButton === "rechargeWallet"
                    ? "bg-[#bfaa20] text-white"
                    : "text-gray-700 hover:bg-gray-200"
                } rounded-lg`}
              >
                <FaWallet className="mr-2" />
                Recharge Wallet
              </button>
              <button
                onClick={() => setActiveButton("pay")}
                className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-left ${
                  activeButton === "pay"
                    ? "bg-[#bfaa20] text-white"
                    : "text-gray-700 hover:bg-gray-200"
                } rounded-lg`}
              >
                <FaCreditCard className="mr-2" />
                Pay
              </button>
              <button
                onClick={() => setActiveButton("bill")}
                className={`flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-left ${
                  activeButton === "bill"
                    ? "bg-[#bfaa20] text-white"
                    : "text-gray-700 hover:bg-gray-200"
                } rounded-lg`}
              >
                <FaFileInvoiceDollar className="mr-2" />
                Saved Cards
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow">
          <h1 className="text-2xl font-bold">
            {mode === "normal" ? "Normal Mode" : "Payment Mode"}
          </h1>
          <div className="flex items-center">
            <label htmlFor="toggleMode" className="mr-2 font-medium">
              {mode === "normal" ? "Switch to Payment Mode" : "Switch to Normal Mode"}
            </label>
            <input
              type="checkbox"
              id="toggleMode"
              className="toggle-checkbox"
              checked={mode === "payment"}
              onChange={toggleMode}
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6 overflow-y-auto">
          {mode === "normal" && activeButton === "paymentDetails" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Real-Time Garbage Management</h2>
              <p className="mb-4">
                Payment details include that if the user’s home is in an urban area, the payment is
                calculated as the user’s garbage weight multiplied by 100. For homes not in urban
                areas, a fixed amount of Rs:1000  is charged.
              </p>
              <p>
                The system supports two payment methods: <strong>Card</strong> and{" "}
                <strong>Wallet</strong>.
              </p>
            </div>
          )}

          {mode === "normal" && activeButton === "history" && (
            <HistorySection paymentHistory={paymentHistory} />
          )}

          {mode === "payment" && activeButton === "rechargeWallet" && (
            <RechargeWallet
            />
          )}

          {mode === "payment" && activeButton === "pay" && (
            <PaySection walletBalance={walletBalance} setWalletBalance={setWalletBalance} />
          )}

          {mode === "payment" && activeButton === "bill" && (
            <BillSection />
          )}
        </main>
      </div>
    </div>
  );
};

export default PaymentPage;
