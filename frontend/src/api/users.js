import api from "./client";
import { MediaApi } from "./media";
import { uploadFile } from "./util";

export const UsersApi = {
  // User
  getUserByUsername: username =>
    api.get(`/users/${username}`).then(res => res.data),

  getCurrentUser: () => api.get("/users/me").then(res => res.data),

  updateCurrentUser: ({ about }) =>
    api.patch("/users/me", { about }).then(res => res.data),

  deleteCurrentUser: () => api.delete("/users/me"),

  // Avatar

  getUserFullAvatarUrl: avatarMediaId =>
    MediaApi.getFullMediaUrl(avatarMediaId),

  getUserAvatarThumbnailUrl: avatarMediaId =>
    MediaApi.getThumbnailMediaUrl(avatarMediaId),

  updateCurrentUserAvatar: avatarFile =>
    uploadFile("/users/me/avatar", avatarFile),

  deleteCurrentUserAvatar: () => api.delete("/users/me/avatar"),

  // Banner

  getUserFullBannerUrl: bannerMediaId =>
    MediaApi.getFullMediaUrl(bannerMediaId),

  getUserBannerThumbnailUrl: bannerMediaId =>
    MediaApi.getThumbnailMediaUrl(bannerMediaId),

  updateCurrentUserBanner: bannerFile =>
    uploadFile("/users/me/banner", bannerFile),

  deleteCurrentUserBanner: () => api.delete("/users/me/banner"),
};
