import { useState } from "react";
import axios from "axios";

interface PaySectionProps {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
}

const PaySection: React.FC<PaySectionProps> = ({ walletBalance, setWalletBalance }) => {
  const [areaType, setAreaType] = useState<"urban" | "non-urban">("urban");
  const [weight, setWeight] = useState<number>(0);
  const [billAmount, setBillAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("wallet");
  const [paymentSuccess, setPaymentSuccess] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string>("");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cvc: "",
    ownerName: "",
    expMonth: "", // Separate input for expiry month
    expYear: "",  // Separate input for expiry year
  });
  const [useSavedCard, setUseSavedCard] = useState<boolean>(false);

  const calculateBill = () => {
    let amount = areaType === "urban" ? weight * 100 : 1000;
    setBillAmount(amount);
  };

  const handlePayment = async () => {
    if (paymentMethod === "wallet") {
      if (walletBalance >= billAmount) {
        try {
          await axios.post("/api/process-payment", {
            method: "wallet",
            amount: billAmount,
          });
          setWalletBalance(walletBalance - billAmount);
          setPaymentSuccess("Payment successful!");
        } catch (error) {
          setPaymentError("Payment failed. Please try again.");
        }
      } else {
        setPaymentError("Insufficient wallet balance.");
      }
    } else {
      // Ensure all card details are filled out
      if (!useSavedCard && (cardDetails.cardNumber === "" || cardDetails.cvc === "" || cardDetails.ownerName === "" || cardDetails.expMonth === "" || cardDetails.expYear === "")) {
        setPaymentError("Please fill in all card details.");
        return;
      }

      // Combine month and year into the "MM/YY" format
      const expDate = `${cardDetails.expMonth}/${cardDetails.expYear.slice(-2)}`;

      try {
        const response = await axios.post("/api/process-payment", {
          method: "card",
          amount: billAmount,
          cardDetails: useSavedCard ? null : { ...cardDetails, expDate }, // Send the formatted expDate
        });
        const { extraAmount } = response.data;

        if (extraAmount > 0) {
          setWalletBalance(walletBalance + extraAmount);
        }
        setPaymentSuccess("Payment successful via card!");

        // Save card details after successful payment
        if (!useSavedCard) {
          await axios.post("/api/save-card", {
            cardNumber: cardDetails.cardNumber,
            ownerName: cardDetails.ownerName,
            expDate,
          });
        }
      } catch (error) {
        setPaymentError("Payment failed. Please try again.");
      }
    }
    setBillAmount(0);
    setWeight(0);
    setPaymentMethod("wallet");
    setCardDetails({
      cardNumber: "",
      cvc: "",
      ownerName: "",
      expMonth: "",
      expYear: "",
    });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Pay Section</h2>
      <div className="mb-4 flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="areaType"
            value="urban"
            checked={areaType === "urban"}
            onChange={() => setAreaType("urban")}
            className="mr-2"
          />
          Urban Area
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="areaType"
            value="non-urban"
            checked={areaType === "non-urban"}
            onChange={() => setAreaType("non-urban")}
            className="mr-2"
          />
          Non-Urban Area
        </label>
      </div>

      <div className="mb-4">
        <label className="mb-[5px]">Enter Waste Weight</label>
        <input
          type="number"
          placeholder="Enter Waste Weight"
          className="input-field border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
        />
      </div>

      <button onClick={calculateBill} className="btn-primary bg-[#bfaa20] text-white py-2 px-4 rounded-lg hover:bg-[#94762c] transition">
        Process
      </button>

      {billAmount > 0 && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-md">
          <p className="text-lg font-medium mb-2">Bill Amount: {billAmount} RS</p>
          <div className="mb-4 flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={paymentMethod === "wallet"}
                onChange={() => setPaymentMethod("wallet")}
                className="mr-2"
              />
              Wallet
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="mr-2"
              />
              Card
            </label>
          </div>

          {paymentMethod === "wallet" && (
            <div>
              <p className="mb-2">Wallet Balance: {walletBalance} RS</p>
              <button onClick={handlePayment} className="btn-primary bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
                Pay
              </button>
            </div>
          )}

          {paymentMethod === "card" && (
            <div>
              <div className="mb-4 flex items-center">
                <label className="mr-2">
                  <input
                    type="checkbox"
                    checked={useSavedCard}
                    onChange={() => setUseSavedCard(!useSavedCard)}
                    className="mr-2"
                  />
                  Use saved card
                </label>
              </div>

              {!useSavedCard && (
                <div className="space-y-2 mb-4">
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="input-field border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cardDetails.ownerName}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, ownerName: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="input-field border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                    }
                  />
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Expiry Month (MM)"
                      className="input-field border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={cardDetails.expMonth}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, expMonth: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Expiry Year (YY)"
                      className="input-field border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={cardDetails.expYear}
                      onChange={(e) =>
                        setCardDetails({ ...cardDetails, expYear: e.target.value })
                      }
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="CVC"
                    className="input-field border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cardDetails.cvc}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvc: e.target.value })
                    }
                  />
                </div>
              )}

              <button onClick={handlePayment} className="btn-primary bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
                Pay
              </button>
            </div>
          )}

          {paymentSuccess && <p className="mt-4 text-green-600">{paymentSuccess}</p>}
          {paymentError && <p className="mt-4 text-red-600">{paymentError}</p>}
        </div>
      )}
    </div>
  );
};

export default PaySection;
