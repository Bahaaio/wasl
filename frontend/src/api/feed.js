import api from "./client";

/** @typedef {import("./types").PostFeedResponse} PostFeedResponse */
/** @typedef {import("./types").SortOrder} SortOrder */

export const FeedApi = {
  /**
   * @param {{ sort?: SortOrder, cursorCreatedAt?: string, cursorId?: number, cursorScore?: number, page?: number, size?: number }}? params - sort mode (sort, default: "latest"), cursor pagination params
   * @returns {Promise<PostFeedResponse>}
   */
  getFeed: (params = {}) => api.get("/feed", { params }).then(res => res.data),
};
