import api from "./client";

/** @typedef {import("./types").CommentDto} CommentDto */
/** @typedef {import("./types").CommentCreateRequest} CommentCreateRequest */
/** @typedef {import("./types").CommentPatchRequest} CommentPatchRequest */
/** @typedef {import("./types").VoteAction} VoteAction */

export const CommentsApi = {
  /**
   * @param {number} postId
   * @param {CommentCreateRequest} request
   * @returns {Promise<CommentDto>}
   */
  reply: (postId, request) =>
    api.post(`/posts/${postId}/comments`, request).then(res => res.data),

  /**
   * @param {number} id
   * @returns {Promise<CommentDto>}
   */
  getCommentById: id => api.get(`/comments/${id}`).then(res => res.data),

  /**
   * @param {number} id
   * @param {CommentPatchRequest} request
   * @returns {Promise<CommentDto>}
   */
  patchComment: (id, request) =>
    api.patch(`/comments/${id}`, request).then(res => res.data),

  /**
   * @param {number} id
   * @returns {Promise<void>}
   */
  deleteComment: id => api.delete(`/comments/${id}`),

  /**
   * @param {number} id
   * @param {VoteRequest["action"]} action
   * @returns {Promise<void>}
   */
  voteComment: (id, action) =>
    api.post(`/comments/${id}/vote`, { action }).then(() => undefined),
};
