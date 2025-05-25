"use client";

import "./globals.css";
import Link from "next/link";
import { ThirdwebProvider } from "thirdweb/react";
import { AuthButton } from "./components/AuthButton";
import { Provider } from "react-redux";
import { store } from "@/app/store/store";
import { NavBar } from "./components/NavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThirdwebProvider>
        <html lang="en">
          <head>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@600&display=swap"
              rel="stylesheet"
            />
          </head>
          <body className="bg-brand-light text-brand-textDark font-sans antialiased">
            {/* Navigation Bar */}
            <NavBar></NavBar>

            {/* Page Content */}
            <main>{children}</main>
          </body>
        </html>
      </ThirdwebProvider>
    </Provider>
  );
}