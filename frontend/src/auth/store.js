let access_token = null;
let user_info = null;
let listeners = [];

export const setAccessToken = token => {
  access_token = token;
  notifyListeners();
};

export const getAccessToken = () => access_token;

export const setUser = user => {
  user_info = user;
  notifyListeners();
};

export const getUser = () => user_info;

export const clearAccessToken = () => {
  access_token = null;
  user_info = null;
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
