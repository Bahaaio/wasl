import { createContext, useEffect, useMemo, useState } from "react";
import { getUser, onAuthChange, setUser as storeSetUser } from "./store.js";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => getUser());

  useEffect(() => {
    const unsubscribe = onAuthChange(({ user: nextUser }) => {
      setUserState(nextUser);
    });

    return unsubscribe;
  }, []);

  const setUser = nextUser => {
    storeSetUser(nextUser);
  };

  const value = useMemo(() => ({ user, setUser, isLoggedIn: !!user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
