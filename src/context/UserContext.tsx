import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../utils/supabaseClient";
import { supabaseService } from "~/services/supabaseService";

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  logout: async () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const user = await supabaseService.getCurrentUser();
      if (user) {
        setUser({
          id: user.id,
          email: user.email || "",
          displayName: user.user_metadata?.displayName || "",
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    // On mount, restore session if exists
    const restoreSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          displayName: session.user.user_metadata?.displayName || "",
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        switch (event) {
          case "INITIAL_SESSION":
            console.log("Initial session");
            break;
          case "SIGNED_IN":
            console.log("Signed in");
            getUser();
            setIsAuthenticated(true);
            break;
          case "SIGNED_OUT":
            console.log("Signed out");
            setUser(null);
            setIsAuthenticated(false);
            break;
          default:
            console.log("Unknown event");
            break;
        }
      },
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabaseService.signOut();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, isAuthenticated, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
