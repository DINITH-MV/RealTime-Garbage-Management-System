"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { ClerkProvider } from "@clerk/nextjs";
import toast, { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <ClerkProvider>
      <Toaster position="top-center"
						reverseOrder={false}
						gutter={13}
						containerClassName=""
						containerStyle={{}}
						toastOptions={{
							// Define default options
							className: '',
							duration: 5000,
							style: {
								background: '#363636',
								color: '#fff',
								boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.2)',
								padding: '4px 4px 4px 8px',
							},

							// Default options for specific types
							success: {
								duration: 5555,
							},
						}}
					/>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://site-assets.fontawesome.com/releases/v6.6.0/css/all.css"
          />
          <link
            rel="stylesheet"
            href="https://site-assets.fontawesome.com/releases/v6.6.0/css/sharp-duotone-solid.css"
          />
          <link
            rel="stylesheet"
            href="https://site-assets.fontawesome.com/releases/v6.6.0/css/sharp-solid.css"
          />
        </head>
        <body suppressHydrationWarning={true}>
          <div className="dark:bg-boxdark-2 dark:text-bodydark">
            {loading ? <Loader /> : children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
