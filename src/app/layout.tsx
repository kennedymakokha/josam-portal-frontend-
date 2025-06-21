'use client'

import "./globals.css";
import { Provider } from 'react-redux';

import { PersistGate } from "redux-persist/integration/react";
import { useEffect, useState } from "react";
import { Toaster } from 'sonner';
import { persistor, store } from "../../store/store";
import { Providers } from "./providers";
import { ThemeProvider } from "../../context/themeContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Only render PersistGate on client
  }, []);

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Provider store={store}>
            {isMounted ? (
              <PersistGate loading={null} persistor={persistor}>
                <Providers>{children}</Providers>
                <Toaster richColors position="top-right" />
              </PersistGate>
            ) : null}
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
