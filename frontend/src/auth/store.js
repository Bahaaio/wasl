const TOKEN_KEY = "access_token";
const USER_KEY = "user_info";

export const setAccessToken = token => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setUser = user => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
