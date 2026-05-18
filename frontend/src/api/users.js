import api from "./client";
import { MediaApi } from "./media";
import { uploadPut } from "./util";

/** @typedef {import("./types").UserDto} UserDto */
/** @typedef {import("./types").PagedModelPostDto} PagedModelPostDto */
/** @typedef {import("./types").UpdateCurrentUserRequest} UpdateCurrentUserRequest */

export const UsersApi = {
  // User
  /**
   * @param {string} username
   * @returns {Promise<UserDto>}
   */
  getUserByUsername: username =>
    api.get(`/users/${username}`).then(res => res.data),

  /**
   * @returns {Promise<UserDto>}
   */
  getCurrentUser: () => api.get("/users/me").then(res => res.data),

  /**
   * @param {string} username
   * @param {{ page?: number, size?: number, sort?: string[] }} [params]
   * @returns {Promise<PagedModelPostDto>}
   */
  listUserPosts: (username, params = {}) =>
    api.get(`/users/${username}/posts`, { params }).then(res => res.data),

  /**
   * @param {UpdateCurrentUserRequest} params
   * @returns {Promise<UserDto>}
   */
  updateCurrentUser: ({ about }) =>
    api.patch("/users/me", { about }).then(res => res.data),

  /**
   * @returns {Promise<void>}
   */
  deleteCurrentUser: () => api.delete("/users/me"),

  // Avatar

  /**
   * @param {string} avatarMediaId
   * @returns {string}
   */
  getUserFullAvatarUrl: avatarMediaId =>
    MediaApi.getFullMediaUrl(avatarMediaId),

  /**
   * @param {string} avatarMediaId
   * @returns {string}
   */
  getUserAvatarThumbnailUrl: avatarMediaId =>
    MediaApi.getThumbnailMediaUrl(avatarMediaId),

  /**
   * @param {File} avatarFile
   * @returns {Promise<{ mediaId: string }>}
   */
  updateCurrentUserAvatar: avatarFile =>
    uploadPut("/users/me/avatar", avatarFile),

  /**
   * @returns {Promise<void>}
   */
  deleteCurrentUserAvatar: () => api.delete("/users/me/avatar"),

  // Banner

  /**
   * @param {string} bannerMediaId
   * @returns {string}
   */
  getUserFullBannerUrl: bannerMediaId =>
    MediaApi.getFullMediaUrl(bannerMediaId),

  /**
   * @param {string} bannerMediaId
   * @returns {string}
   */
  getUserBannerThumbnailUrl: bannerMediaId =>
    MediaApi.getThumbnailMediaUrl(bannerMediaId),

  /**
   * @param {File} bannerFile
   * @returns {Promise<{ mediaId: string }>}
   */
  updateCurrentUserBanner: bannerFile =>
    uploadPut("/users/me/banner", bannerFile),

  /**
   * @returns {Promise<void>}
   */
  deleteCurrentUserBanner: () => api.delete("/users/me/banner"),
};
