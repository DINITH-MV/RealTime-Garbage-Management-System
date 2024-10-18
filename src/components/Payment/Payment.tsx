"use client";
import { useState } from "react";
import axios from "axios";

const Payment: React.FC = () => {
  const [frame, setFrame] = useState<number>(1);
  const [isUrban, setIsUrban] = useState<boolean | null>(null);
  const [weight, setWeight] = useState<number>(0);
  const [calculatedPayment, setCalculatedPayment] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expDateMonth: "",
    expDateYear: "",
    cvc: "",
    cardHolder: "",
  });
  const [walletBalance, setWalletBalance] = useState<number>(500); // example wallet balance
  const [payAmount, setPayAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to calculate payment based on weight and area
  const calculatePayment = () => {
    if (isUrban === null || weight <= 0) return;
    const payment = isUrban ? weight * 100 : 1000;
    setCalculatedPayment(payment);
    setPayAmount(payment);
    setFrame(2); // Move to the payment method selection frame
  };

  // Function to handle the payment process
 // Function to handle the payment process
const handlePayment = async () => {
    setIsLoading(true); // Set loading state
  
    try {
      if (paymentMethod === "card") {
        // Combine expDateMonth and expDateYear into a valid DateTime string
        const expDate = new Date(
          parseInt(cardDetails.expDateYear, 10), 
          parseInt(cardDetails.expDateMonth, 10) - 1, // months are zero-indexed in JavaScript Date object
          1 // Set the day as 1st for expiration date (adjust if needed)
        );
  
        // Format expDate to ISO string
        const formattedExpDate = expDate.toISOString();
  
        // POST card payment data to the API
        const response = await axios.post("/api/Payment", {
          cardNumber: cardDetails.cardNumber,
          expDate: formattedExpDate, // Send valid ISO-8601 DateTime
          cvc: cardDetails.cvc,
          ownerName: cardDetails.cardHolder,
          balance: calculatedPayment,
          history: `Payment of ${calculatedPayment} made on ${new Date().toLocaleDateString()}`, // Date formatted
        });
  
        if (response.data.success) {
          alert("Payment successful!");
          setFrame(5); // Move to thank you frame after payment
        } else {
          alert(response.data.message);
        }
      } else if (paymentMethod === "wallet") {
        if (walletBalance >= payAmount) {
          setWalletBalance(walletBalance - payAmount);
          alert("Payment successful using wallet!");
          setFrame(5); // Move to the thank you frame after payment
        } else {
          alert("Low wallet balance.");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
      {frame === 1 && (
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-semibold mb-6">Payment Calculation</h1>
          <div className="mb-6">
            <label className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={isUrban === true}
                onChange={() => setIsUrban(true)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">House in Urban Area</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isUrban === false}
                onChange={() => setIsUrban(false)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2">House not in Urban Area</span>
            </label>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Enter Waste Weight (kg):</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={calculatePayment}
              className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Go to Payment
            </button>
          </div>
        </div>
      )}

      {frame === 2 && (
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-semibold mb-6">Payment Method</h1>
          <h2 className="text-xl font-medium mb-4">Calculated Payment: {calculatedPayment}</h2>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Select Payment Method:</label>
            <button
              onClick={() => {
                setFrame(3);
                setPaymentMethod("card");
              }}
              className="w-full bg-blue-500 text-white py-2 rounded-md mb-2 hover:bg-blue-600"
            >
              Card
            </button>
            <button
              onClick={() => {
                setFrame(4);
                setPaymentMethod("wallet");
              }}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Wallet
            </button>
          </div>
        </div>
      )}

      {isLoading && <div>Loading...</div>} {/* Loading indicator */}

      {frame === 3 && paymentMethod === "card" && (
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-semibold mb-6">Card Payment</h1>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, cardNumber: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="MM"
              value={cardDetails.expDateMonth}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,2}$/.test(value) && parseInt(value, 10) <= 12) {
                  setCardDetails({ ...cardDetails, expDateMonth: value });
                }
              }}
              className="w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="YYYY"
              value={cardDetails.expDateYear}
              onChange={(e) => setCardDetails({ ...cardDetails, expDateYear: e.target.value })}
              className="w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="CVC"
              value={cardDetails.cvc}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, cvc: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardDetails.cardHolder}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, cardHolder: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <h3 className="text-xl font-medium mb-4">Payment Amount: {payAmount}</h3>
          <input
            type="number"
            placeholder="Enter Payment Amount"
            value={payAmount}
            onChange={(e) => setPayAmount(parseFloat(e.target.value))}
            className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlePayment}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Pay
          </button>
        </div>
      )}

      {frame === 4 && paymentMethod === "wallet" && (
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-semibold mb-6">Wallet Payment</h1>
          <h3 className="text-xl font-medium mb-4">Wallet Balance: {walletBalance}</h3>
          <h3 className="text-xl font-medium mb-4">Payment Amount: {payAmount}</h3>
          <button
            onClick={handlePayment}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Pay with Wallet
          </button>
        </div>
      )}

      {frame === 5 && (
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-semibold mb-6">Thank you!</h1>
          <p>Your payment has been processed successfully.</p>
        </div>
      )}
    </div>
  );
};

export default Payment;
