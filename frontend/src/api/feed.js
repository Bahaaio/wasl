import api from "./client";

/** @typedef {import("./types").PostFeedResponse} PostFeedResponse */
/** @typedef {import("./types").FeedSort} FeedSort */

export const FeedApi = {
  /**
   * Get the user's feed with cursor-based pagination.
   *
   * @param {{
   *   sort?: FeedSort,
   *   cursorCreatedAt?: string,
   *   cursorId?: number,
   *   cursorScore?: number,
   *   page?: number,
   *   size?: number,
   *   sort?: string[]
   * }} [params]
   * @returns {Promise<PostFeedResponse>}
   */
  getFeed: params => api.get("/feed", { params }).then(res => res.data),
};
