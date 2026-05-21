import api from "./client";

const LOCAL_COMMENT_VOTES_KEY = "wasl.localVotes.comments";

function readCommentVotes() {
  try {
    const raw = window.localStorage.getItem(LOCAL_COMMENT_VOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeCommentVotes(value) {
  try {
    window.localStorage.setItem(
      LOCAL_COMMENT_VOTES_KEY,
      JSON.stringify(value)
    );
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

function deriveCommentVote(comment) {
  const explicit = comment?.vote;
  if (explicit === "UPVOTE" || explicit === "DOWNVOTE" || explicit === "NONE") {
    return explicit;
  }
  if (comment?.upvoted === true) return "UPVOTE";
  if (comment?.downvoted === true) return "DOWNVOTE";
  return "NONE";
}

export function setCommentLocalVote(commentId, action) {
  if (!commentId) return;
  const votes = readCommentVotes();
  votes[String(commentId)] = normalizeVote(action);
  writeCommentVotes(votes);
}

export function getCommentNetVoteScore(comment) {
  if (!comment || typeof comment !== "object") {
    return 0;
  }

  if (typeof comment.score === "number" && Number.isFinite(comment.score)) {
    return comment.score;
  }

  const upvoteCount =
    comment.upvoteCount ??
    comment.upvotes ??
    comment.likes ??
    comment.voteUp ??
    0;
  const downvoteCount =
    comment.downvoteCount ??
    comment.downvotes ??
    comment.dislikes ??
    comment.voteDown ??
    0;

  const baseScore =
    Number.isFinite(Number(upvoteCount)) && Number.isFinite(Number(downvoteCount))
      ? Number(upvoteCount) - Number(downvoteCount)
      : 0;

  if (upvoteCount || downvoteCount) {
    return baseScore;
  }

  const vote = deriveCommentVote(comment);
  if (vote === "UPVOTE") return 1;
  if (vote === "DOWNVOTE") return -1;
  return 0;
}

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
