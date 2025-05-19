import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Geist } from "next/font/google";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { setupDefaultTags } from "../utils/setupDefaultTags";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // Initialize default tags when the app starts
  useEffect(() => {
    // Setup default tags in the database
    setupDefaultTags()
      .then(() => console.log('Default tags setup complete'))
      .catch(err => console.error('Error setting up default tags:', err));
  }, []);
  
  return (
    <SessionProvider session={session}>
      <div className={geist.className}>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
