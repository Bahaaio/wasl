import api from "./client";

export const PostsApi = {
  // Posts

  getPostById: id => api.get(`/posts/${id}`).then(res => res.data),

  createPost: request => api.post("/posts", request).then(res => res.data),

  patchPost: (id, request) =>
    api.patch(`/posts/${id}`, request).then(res => res.data),

  deletePost: id => api.delete(`/posts/${id}`),

  votePost: (id, action) =>
    api.post(`/posts/${id}/vote`, { action }).then(() => undefined),

  listPostComments: (postId, params = {}) =>
    api.get(`/posts/${postId}/comments`, { params }).then(res => res.data),
};
