import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Geist } from "next/font/google";
import Navbar from "../components/Navbar";
import { UserContextProvider } from "../context/UserContext";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <UserContextProvider>
        <div className={geist.className}>
          <Navbar />
          <Component {...pageProps} />
        </div>
      </UserContextProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
