import { createContext, useEffect, useMemo, useState } from "react";
import {
  getUser,
  onAuthChange,
  setUser as storeSetUser,
  setAccessToken,
} from "./store.js";
import api from "../api/client";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => getUser());

  useEffect(() => {
    const unsubscribe = onAuthChange(({ user: nextUser }) => {
      setUserState(nextUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Try refreshing access token on app start so API calls include auth
    // and endpoints like /users/{username}/posts can return vote state.
    let mounted = true;

    (async () => {
      try {
        const resp = await api.post("/auth/refresh");
        const token = resp?.data?.accessToken;
        if (token) {
          setAccessToken(token);
        }

        // If we have a token, try to load current user and update store
        if (token) {
          try {
            const me = await api.get("/users/me");
            if (mounted) storeSetUser(me.data);
          } catch (err) {
            // ignore
          }
        }
      } catch (err) {
        // ignore - user may not be authenticated
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const setUser = nextUser => {
    storeSetUser(nextUser);
  };

  const value = useMemo(() => ({ user, setUser, isLoggedIn: !!user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
