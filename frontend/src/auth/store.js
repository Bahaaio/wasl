// Persist auth state in localStorage so refreshes keep the user logged in
let access_token =
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
let user_info = null;
try {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("user");
    user_info = raw ? JSON.parse(raw) : null;
  }
} catch (err) {
  user_info = null;
  console.debug("auth/store: failed to read user from localStorage:", err);
}

let listeners = [];

export const setAccessToken = token => {
  access_token = token;
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

export const getAccessToken = () => access_token;

export const setUser = user => {
  user_info = user;
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

export const getUser = () => user_info;

export const clearAccessToken = () => {
  access_token = null;
  user_info = null;
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
    listener({ token: access_token, user: user_info })
  );
};

export const onAuthChange = callback => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};
