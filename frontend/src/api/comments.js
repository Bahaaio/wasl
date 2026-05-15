import api from "./client";

export const CommentsApi = {
  reply: (postId, request) =>
    api.post(`/posts/${postId}/comments`, request).then(res => res.data),

  getCommentById: id => api.get(`/comments/${id}`).then(res => res.data),

  patchComment: (id, request) =>
    api.patch(`/comments/${id}`, request).then(res => res.data),

  deleteComment: id => api.delete(`/comments/${id}`),

  voteComment: (id, action) =>
    api.post(`/comments/${id}/vote`, { action }).then(() => undefined),
};
