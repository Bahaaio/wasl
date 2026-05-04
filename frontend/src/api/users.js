import api from "./client";
import { getMedia, uploadFile } from "./util";

export const usersApi = {
  // User
  getUserByUsername: username =>
    api.get(`/users/${username}`).then(res => res.data),

  getCurrentUser: () => api.get("/users/me").then(res => res.data),

  updateCurrentUser: ({ about }) =>
    api.put("/users/me", { about }).then(res => res.data),

  deleteCurrentUser: () => api.delete("/users/me"),

  // Avatar

  getCurrentUserFullAvatar: avatarMediaId => getMedia(avatarMediaId),

  getCurrentUserAvatarThumbnail: avatarMediaId => getMedia(avatarMediaId, true),

  updateCurrentUserAvatar: avatarFile =>
    uploadFile("/users/me/avatar", avatarFile),

  deleteCurrentUserAvatar: () => api.delete("/users/me/avatar"),

  // Banner

  getCurrentUserFullBanner: bannerMediaId => getMedia(bannerMediaId),

  getCurrentUserBannerThumbnail: bannerMediaId => getMedia(bannerMediaId, true),

  updateCurrentUserBanner: bannerFile =>
    uploadFile("/users/me/banner", bannerFile),

  deleteCurrentUserBanner: () => api.delete("/users/me/banner"),
};
