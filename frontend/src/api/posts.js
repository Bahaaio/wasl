import api from "./client";

/** @typedef {import("./types").PostDto} PostDto */
/** @typedef {import("./types").PostCreateRequest} PostCreateRequest */
/** @typedef {import("./types").PostPatchRequest} PostPatchRequest */
/** @typedef {import("./types").VoteAction} VoteAction */
/** @typedef {import("./types").CommentFeedResponse} CommentFeedResponse */

export const PostsApi = {
  // Posts

  /**
   * @param {number} id
   * @returns {Promise<PostDto>}
   */
  getPostById: id => api.get(`/posts/${id}`).then(res => res.data),

  /**
   * @param {PostCreateRequest} request
   * @returns {PostDto}
   */
  createPost: request => api.post("/posts", request).then(res => res.data),

  /**
   * @param {number} id
   * @param {PostPatchRequest} request
   * @returns {Promise<PostDto>}
   */
  patchPost: (id, request) =>
    api.patch(`/posts/${id}`, request).then(res => res.data),

  /**
   * @param {number} id
   * @returns {Promise<void>}
   */
  deletePost: id => api.delete(`/posts/${id}`),

  /**
   * @param {number} id
   * @param {VoteRequest["action"]} action
   * @returns {Promise<void>}
   */
  votePost: (id, action) =>
    api.post(`/posts/${id}/vote`, { action }).then(() => undefined),

  /**
   * @param {number} postId
   * @param {{ page?: number, size?: number, sort?: string[] }} [params]
   * @returns {Promise<CommentFeedResponse>}
   */
  listPostComments: (postId, params = {}) =>
    api.get(`/posts/${postId}/comments`, { params }).then(res => res.data),
};
