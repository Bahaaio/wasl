// Persist auth state in localStorage so refreshes keep the user logged in
let accessToken =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
let userInfo = null;
try {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("user");
    userInfo = raw ? JSON.parse(raw) : null;
  }
} catch (err) {
  userInfo = null;
  console.debug("auth/store: failed to read user from localStorage:", err);
}

let listeners = [];

export const setAccessToken = token => {
  accessToken = token;
  try {
    if (typeof window !== "undefined") {
      if (token) localStorage.setItem("accessToken", token);
      else localStorage.removeItem("accessToken");
    }
  } catch (err) {
    console.debug(
      "auth/store: failed to write accessToken to localStorage:",
      err
    );
  }
  notifyListeners();
};

export const getAccessToken = () => accessToken;

export const setUser = user => {
  userInfo = user;
  try {
    if (typeof window !== "undefined") {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    }
  } catch (err) {
    console.debug("auth/store: failed to write user to localStorage:", err);
  }
  notifyListeners();
};

export const getUser = () => userInfo;

export const clearAccessToken = () => {
  accessToken = null;
  userInfo = null;
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  } catch (err) {
    console.debug("auth/store: failed to clear localStorage:", err);
  }
  notifyListeners();
};

// Observer pattern for auth state changes
const notifyListeners = () => {
  listeners.forEach(listener =>
    listener({ token: accessToken, user: userInfo })
  );
};

export const onAuthChange = callback => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};
