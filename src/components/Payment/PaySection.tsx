import { useState, useEffect } from "react";
import axios from "axios";

interface PaySectionProps {
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
}

interface CardDetails {
  cardNumber: string;
  cvc: string;
  ownerName: string;
  expMonth: string;
  expYear: string;
}

const PaySection: React.FC<PaySectionProps> = ({
  walletBalance,
  setWalletBalance,
}) => {
  const [areaType, setAreaType] = useState<"urban" | "non-urban">("urban");
  const [weight, setWeight] = useState<number>(0);
  const [billAmount, setBillAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">(
    "wallet"
  );
  const [paymentSuccess, setPaymentSuccess] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string>("");

  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    cvc: "",
    ownerName: "",
    expMonth: "",
    expYear: "",
  });

  const [useSavedCard, setUseSavedCard] = useState<boolean>(false);
  const [savedCards, setSavedCards] = useState<CardDetails[]>([]); // Store list of saved cards
  const [selectedSavedCard, setSelectedSavedCard] = useState<CardDetails | null>(null); // Track selected saved card
  const [selectedSavedCardIndex, setSelectedSavedCardIndex] = useState<number | null>(null); // Track selected saved card index

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (useSavedCard) {
      getPaymentCardDetails();
    }
  }, [useSavedCard]);

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

      // Ensure the response contains an array of saved card details
      if (!Array.isArray(data.PaymentCardDetails)) {
        throw new Error("Invalid data format received from API");
      }

      setSavedCards(data.PaymentCardDetails); // Store the list of saved cards
    } catch (error) {
      console.error("Error loading Payment Card Details: ", error);
      setError((error as Error).message || "Failed to load payment card details.");
    } finally {
      setLoading(false); // End the loading state
    }
  };

  const handleSelectSavedCard = (card: CardDetails) => {
    setSelectedSavedCard(card); // Set selected card details
  };

  const validateCardDetails = () => {
    const cardNumberPattern = /^[0-9]{16}$/; // 16 digits for card number
    const cvcPattern = /^[0-9]{3,4}$/; // 3 or 4 digits for CVC
    const expMonthPattern = /^(0[1-9]|1[0-2])$/; // MM format
    const expYearPattern = /^[0-9]{2}$/; // YY format

    if (weight <= 0) {
      setPaymentError("Please enter a valid weight.");
      return false;
    }

    if (!useSavedCard && !selectedSavedCard) {
      if (!cardDetails.ownerName) {
        setPaymentError("Please enter the cardholder's name.");
        return false;
      }

      if (!cardNumberPattern.test(cardDetails.cardNumber)) {
        setPaymentError("Please enter a valid 16-digit card number.");
        return false;
      }

      if (!cvcPattern.test(cardDetails.cvc)) {
        setPaymentError("Please enter a valid CVC.");
        return false;
      }

      if (!expMonthPattern.test(cardDetails.expMonth)) {
        setPaymentError("Please enter a valid expiry month (MM).");
        return false;
      }

      if (!expYearPattern.test(cardDetails.expYear)) {
        setPaymentError("Please enter a valid expiry year (YY).");
        return false;
      }
    }

    setPaymentError(""); // Clear any previous errors if validation passes
    return true;
  };

  const calculateBill = () => {
    let amount = areaType === "urban" ? weight * 1000 : 1000;
    setBillAmount(amount);
  };

  const handlePayment = async () => {
    if (!validateCardDetails()) {
      return; // Stop if validation fails
    }

    if (paymentMethod === "wallet") {
      // Handle wallet payment logic...
    } else {
      const expMonth = parseInt(selectedSavedCard ? selectedSavedCard.expMonth : cardDetails.expMonth);
      const expYear = parseInt(selectedSavedCard ? selectedSavedCard.expYear : cardDetails.expYear);

      // Check if month and year are valid numbers
      if (isNaN(expMonth) || isNaN(expYear)) {
        setPaymentError("Invalid expiry date format.");
        return;
      }

      const expDate = new Date(expYear, expMonth - 1); // Create a Date object

      try {
        // Perform the API call to process the payment
        const response = await axios.post("/api/Payment", {
          cardNumber: selectedSavedCard ? selectedSavedCard.cardNumber : cardDetails.cardNumber,
          expDate: expDate.toISOString(), // Send valid ISO-8601 DateTime
          cvc: selectedSavedCard ? selectedSavedCard.cvc : cardDetails.cvc,
          ownerName: selectedSavedCard ? selectedSavedCard.ownerName : cardDetails.ownerName,
          balance: billAmount,
          history: `Payment of ${billAmount} made on ${new Date().toLocaleDateString()}`, // Date formatted
        });

        const { extraAmount } = response.data;
        if (extraAmount > 0) {
          setWalletBalance(walletBalance + extraAmount);
        }

        setPaymentSuccess("Payment successful via card!");
        alert(
          `Payment successful! Extra amount added: ${extraAmount ? extraAmount : 0}`
        );
      } catch (error) {
        const errorMessage = (error as any).response
          ? (error as any).response.data
          : (error as any).message;
        alert(`Payment failed: ${errorMessage}`);
      }
    }
    resetPaymentForm();
  };

  const resetPaymentForm = () => {
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
    setSelectedSavedCardIndex(null); // Reset the selected saved card index
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="text-gray-800 mb-6 text-2xl font-semibold">Pay Section</h2>

      {/* Area Type Selection */}
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

      {/* Weight Input */}
      <div className="mb-4">
        <label className="mb-[5px]">Enter Waste Weight</label>
        <input
          type="number"
          placeholder="Enter Waste Weight"
          className="input-field border-gray-300 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
        />
      </div>

      <button
        onClick={calculateBill}
        className="btn-primary rounded-lg bg-[#bfaa20] px-4 py-2 text-white transition hover:bg-[#94762c]"
      >
        Process
      </button>

      {billAmount > 0 && (
        <div className="bg-gray-50 mt-4 rounded-lg p-4 shadow-md">
          <p className="mb-2 text-lg font-medium">Bill Amount: Rs: {billAmount}</p>

          {/* Payment Method Selection */}
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
              <p className="mb-2">Wallet Balance Rs: {walletBalance} </p>
              <button
                onClick={handlePayment}
                className="btn-primary rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
              >
                Pay
              </button>
            </div>
          )}

          {paymentMethod === "card" && (
            <div>
              {/* Saved Cards Section */}
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={useSavedCard}
                  onChange={() => setUseSavedCard(!useSavedCard)}
                  className="mr-2"
                />
                <label>Use saved card</label>
              </div>

              {useSavedCard && (
                <div>
                  <h3>Select a Saved Card</h3>
                  {/* List of saved cards fetched from backend */}
                  {savedCards.map((card, index) => (
                    <div key={index} className="mb-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="savedCard"
                          value={index}
                          checked={selectedSavedCardIndex === index}
                          onChange={() => setSelectedSavedCardIndex(index)}
                          className="mr-2"
                        />
                        <span>Card Ending in {card.cardNumber.slice(-4)}</span>
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Render card input if no saved card is selected */}
              {!useSavedCard && !selectedSavedCard && (
                <div className="mb-4 space-y-2">
                  {/* Card Input Fields */}
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="input-field border-gray-300 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cardDetails.ownerName}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        ownerName: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="input-field border-gray-300 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({
                        ...cardDetails,
                        cardNumber: e.target.value,
                      })
                    }
                  />
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Expiry Month (MM)"
                      className="input-field border-gray-300 w-1/2 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={cardDetails.expMonth}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expMonth: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Expiry Year (YY)"
                      className="input-field border-gray-300 w-1/2 rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={cardDetails.expYear}
                      onChange={(e) =>
                        setCardDetails({
                          ...cardDetails,
                          expYear: e.target.value,
                        })
                      }
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="CVC"
                    className="input-field border-gray-300 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={cardDetails.cvc}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvc: e.target.value })
                    }
                  />
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                className="btn-primary rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
              >
                Pay
              </button>
            </div>
          )}

          {/* Payment Feedback */}
          {paymentSuccess && (
            <p className="mt-4 text-green-600">{paymentSuccess}</p>
          )}
          {paymentError && <p className="text-red-600 mt-4">{paymentError}</p>}
        </div>
      )}
    </div>
  );
};

export default PaySection;
