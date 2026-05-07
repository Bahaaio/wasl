let accessToken = null;

// Persist user state in localStorage
let userInfo = null;
try {
  const raw = localStorage.getItem("user");
  userInfo = raw ? JSON.parse(raw) : null;
} catch (err) {
  userInfo = null;
  console.debug("auth/store: failed to read user from localStorage:", err);
}

let listeners = [];

export const setAccessToken = token => (accessToken = token);

export const getAccessToken = () => accessToken;

export const setUser = user => {
  userInfo = user;
  try {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  } catch (err) {
    console.debug("auth/store: failed to write user to localStorage:", err);
  }

  notifyListeners();
};

export const getUser = () => userInfo;

export const clearAccessToken = () => (accessToken = null);

// Observer pattern for auth state changes
const notifyListeners = () => {
  listeners.forEach(listener => listener({ user: userInfo }));
};

export const onAuthChange = callback => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};
