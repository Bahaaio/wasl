import api from "./client";
import { clearAccessToken, setAccessToken } from "../auth/store";

export const register = async ({ username, email, password }) => {
  const { data } = await api.post("/auth/register", {
    username,
    email,
    password,
  });

  setAccessToken(data.access_token);
};

export const login = async ({ username, password }) => {
  const { data } = await api.post("/auth/login", {
    username,
    password,
  });

  setAccessToken(data.access_token);
};

export const logout = async () => {
  await api.post("/auth/logout");
  clearAccessToken();
};
