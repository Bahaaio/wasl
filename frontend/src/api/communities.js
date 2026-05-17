import api from "./client";
import { uploadFile } from "./util";

/** @typedef {import("./types").CommunityDto} CommunityDto */
/** @typedef {import("./types").CommunityCreateRequest} CommunityCreateRequest */
/** @typedef {import("./types").CommunityPatchRequest} CommunityPatchRequest */
/** @typedef {import("./types").CommunityCategoryDto} CommunityCategoryDto */
/** @typedef {import("./types").CommunityMembershipDto} CommunityMembershipDto */
/** @typedef {import("./types").PagedModelCommunityDto} PagedModelCommunityDto */
/** @typedef {import("./types").PagedModelCommunityMembershipDto} PagedModelCommunityMembershipDto */

export const CommunitiesApi = {
  // Communities

  /**
   * Get all communities with pagination
   * @param {{ page?: number, size?: number, sort?: string[] }} [params]
   * @returns {Promise<PagedModelCommunityDto>}
   */
  getAllCommunities: (params = {}) =>
    api.get("/communities", { params }).then(res => res.data),

  /**
   * Get a specific community by name
   * @param {string} name
   * @returns {Promise<CommunityDto>}
   */
  getCommunityByName: name =>
    api.get(`/communities/${name}`).then(res => res.data),

  /**
   * Create a new community
   * @param {CommunityCreateRequest} request
   * @returns {Promise<CommunityDto>}
   */
  createCommunity: request =>
    api.post("/communities", request).then(res => res.data),

  /**
   * Update a community
   * @param {string} name
   * @param {CommunityPatchRequest} request
   * @returns {Promise<CommunityDto>}
   */
  patchCommunity: (name, request) =>
    api.patch(`/communities/${name}`, request).then(res => res.data),

  /**
   * Join a community
   * @param {string} name
   * @returns {Promise<void>}
   */
  joinCommunity: name =>
    api.post(`/communities/${name}/join`).then(() => undefined),

  /**
   * Leave a community
   * @param {string} name
   * @returns {Promise<void>}
   */
  leaveCommunity: name =>
    api.post(`/communities/${name}/leave`).then(() => undefined),

  /**
   * Get community members with pagination
   * @param {string} name
   * @param {{ page?: number, size?: number, sort?: string[] }} [params]
   * @returns {Promise<PagedModelCommunityMembershipDto>}
   */
  getCommunityMembers: (name, params = {}) =>
    api.get(`/communities/${name}/members`, { params }).then(res => res.data),

  /**
   * Remove a member from a community (requires mod/owner)
   * @param {string} name
   * @param {string} username
   * @returns {Promise<void>}
   */
  removeMember: (name, username) =>
    api
      .delete(`/communities/${name}/members/${username}`)
      .then(() => undefined),

  /**
   * Update community icon
   * @param {string} name
   * @param {File} file
   * @returns {Promise<{mediaId: string}>}
   */
  updateCommunityIcon: (name, file) =>
    uploadFile(`/communities/${name}/icon`, file),

  /**
   * Delete community icon
   * @param {string} name
   * @returns {Promise<void>}
   */
  deleteCommunityIcon: name =>
    api.delete(`/communities/${name}/icon`).then(() => undefined),

  /**
   * Update community banner
   * @param {string} name
   * @param {File} file
   * @returns {Promise<{mediaId: string}>}
   */
  updateCommunityBanner: (name, file) =>
    uploadFile(`/communities/${name}/banner`, file),

  /**
   * Delete community banner
   * @param {string} name
   * @returns {Promise<void>}
   */
  deleteCommunityBanner: name =>
    api.delete(`/communities/${name}/banner`).then(() => undefined),

  // Categories

  /**
   * Get all community categories
   * @returns {Promise<CommunityCategoryDto[]>}
   */
  getAllCategories: () =>
    api.get("/community-categories").then(res => res.data),
};
