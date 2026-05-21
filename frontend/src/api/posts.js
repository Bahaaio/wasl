import api from "./client";

const LOCAL_POST_VOTES_KEY = "wasl.localVotes.posts";

function readPostVotes() {
  try {
    const raw = window.localStorage.getItem(LOCAL_POST_VOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writePostVotes(value) {
  try {
    window.localStorage.setItem(LOCAL_POST_VOTES_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
}

function normalizeVote(action) {
  if (action === "UPVOTE" || action === "DOWNVOTE" || action === "NONE") {
    return action;
  }
  return "NONE";
}

function derivePostVote(post) {
  const explicit = post?.vote;
  if (explicit === "UPVOTE" || explicit === "DOWNVOTE" || explicit === "NONE") {
    return explicit;
  }
  if (post?.upvoted === true) return "UPVOTE";
  if (post?.downvoted === true) return "DOWNVOTE";
  return "NONE";
}

export function setPostLocalVote(postId, action) {
  if (!postId) return;
  const votes = readPostVotes();
  votes[String(postId)] = normalizeVote(action);
  writePostVotes(votes);
}

export function applyLocalVotesToPosts(posts) {
  if (!Array.isArray(posts)) {
    return [];
  }

  const votes = readPostVotes();
  return posts.map(post => {
    if (!post?.id) {
      return post;
    }

    const vote = votes[String(post.id)];
    if (!vote) {
      return post;
    }

    return {
      ...post,
      vote,
      upvoted: vote === "UPVOTE",
      downvoted: vote === "DOWNVOTE",
    };
  });
}

export function sortPostsByCreatedAtDesc(posts) {
  if (!Array.isArray(posts)) {
    return [];
  }

  return [...posts].sort((a, b) => {
    const at = new Date(a?.createdAt || 0).getTime();
    const bt = new Date(b?.createdAt || 0).getTime();
    return bt - at;
  });
}

export function getPostNetVoteScore(post) {
  if (!post || typeof post !== "object") {
    return 0;
  }

  if (typeof post.score === "number" && Number.isFinite(post.score)) {
    return post.score;
  }

  const upvoteCount =
    post.upvoteCount ?? post.upvotes ?? post.likes ?? post.voteUp ?? 0;
  const downvoteCount =
    post.downvoteCount ?? post.downvotes ?? post.dislikes ?? post.voteDown ?? 0;

  const baseScore =
    Number.isFinite(Number(upvoteCount)) && Number.isFinite(Number(downvoteCount))
      ? Number(upvoteCount) - Number(downvoteCount)
      : 0;

  if (upvoteCount || downvoteCount) {
    return baseScore;
  }

  const vote = derivePostVote(post);
  if (vote === "UPVOTE") return 1;
  if (vote === "DOWNVOTE") return -1;
  return 0;
}

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
