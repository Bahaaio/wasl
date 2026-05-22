import api from "./client";

/** @typedef {import("./types").PagedModelUserDto} PagedModelUserDto */
/** @typedef {import("./types").PagedModelPostDto} PagedModelPostDto */
/** @typedef {import("./types").PagedModelCommentDto} PagedModelCommentDto */
/** @typedef {import("./types").PagedModelCommunityDto} PagedModelCommunityDto */
/** @typedef {import("./types").SearchTimeFilter} SearchTimeFilter */
/** @typedef {import("./types").SortOrder} SortOrder */

export const SearchApi = {
  /**
   * @param {string} q
   * @param {{ page?: number, size?: number }} params?
   * @returns {Promise<PagedModelCommunityDto>}
   */
  searchCommunities: (q, params = {}) =>
    api
      .get("/search/communities", { params: { q, ...params } })
      .then(res => res.data),

  /**
   * @param {string} q - search query
   * @param {{ t?: SearchTimeFilter, c?: string, page?: number, size?: number, sort?: SortOrder }}? params - time filter (t, default: "all"), community filter (c by name)
   * @returns {Promise<PagedModelPostDto>}
   */
  searchPosts: (q, params = {}) =>
    api
      .get("/search/posts", { params: { q, ...params } })
      .then(res => res.data),

  /**
   * @param {string} q - search query
   * @param {{ t?: SearchTimeFilter, c?: string, page?: number, size?: number, sort?: SortOrder }}? params - time filter (t, default: "all"), community filter (c by name)
   * @returns {Promise<PagedModelCommentDto>}
   */
  searchComments: (q, params = {}) =>
    api
      .get("/search/comments", { params: { q, ...params } })
      .then(res => res.data),

  /**
   * @param {string} q
   * @param {{ page?: number, size?: number }} params?
   * @returns {Promise<PagedModelUserDto>}
   */
  searchUsers: (q, params = {}) =>
    api
      .get("/search/users", { params: { q, ...params } })
      .then(res => res.data),
};
