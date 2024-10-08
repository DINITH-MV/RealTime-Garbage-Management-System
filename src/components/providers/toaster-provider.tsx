"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={13}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: "",
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
          boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.2)",
          padding: "4px 4px 4px 8px",
        },

        // Default options for specific types
        success: {
          duration: 5555,
        },
      }}
    />
  );
};
