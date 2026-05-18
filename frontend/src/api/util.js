import api from "./client";

/** @typedef {import("./types").UploadResponse} UploadResponse */

/**
 * @param {{ score?: number, upvotes?: number | string, downvotes?: number | string }} entity
 * @returns {number}
 */
export function getNetVoteScore(entity) {
  if (typeof entity?.score === "number") {
    return entity.score;
  }

  const upvotes = parseVoteCount(entity?.upvotes);
  const downvotes = parseVoteCount(entity?.downvotes);

  if (upvotes === null || downvotes === null) {
    return 0;
  }

  return upvotes - downvotes;
}

/**
 * @template T extends { createdAt?: string, id?: number }
 * @param {T[]} posts
 * @returns {T[]}
 */
export function sortPostsByCreatedAtDesc(posts) {
  return [...posts].sort((left, right) => {
    const leftTime = parseDateValue(left?.createdAt);
    const rightTime = parseDateValue(right?.createdAt);

    if (leftTime !== rightTime) {
      return rightTime - leftTime;
    }

    return (right?.id ?? 0) - (left?.id ?? 0);
  });
}

/**
 * @param {string} url
 * @param {File} file
 * @returns {Promise<UploadResponse>}
 */
export const uploadPost = async (url, file) => upload("post", url, file);

/**
 * @param {string} url
 * @param {File} file
 * @returns {Promise<UploadResponse>}
 */
export const uploadPut = async (url, file) => upload("put", url, file);

/**
 * @param {"post" | "put"} method
 * @param {string} url
 * @param {File} file
 * @returns {Promise<UploadResponse>}
 */
const upload = async (method, url, file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Ensure we don't send the instance default `application/json` header.
  // Setting Content-Type to `undefined` lets the browser set the correct
  // multipart/form-data boundary. Also increase timeout for larger files.
  const res = await api.request({
    url,
    method,
    data: formData,
    headers: { "Content-Type": undefined },
    timeout: 30000,
  });

  return res.data;
};

function parseVoteCount(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const compactMatch = value
    .trim()
    .toLowerCase()
    .match(/^(\d+(?:\.\d+)?)([kmb])?$/);
  if (!compactMatch) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const amount = Number(compactMatch[1]);
  if (!Number.isFinite(amount)) {
    return null;
  }

  const multipliers = {
    k: 1_000,
    m: 1_000_000,
    b: 1_000_000_000,
  };

  const suffix = compactMatch[2];
  return suffix ? Math.round(amount * multipliers[suffix]) : amount;
}

function parseDateValue(value) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}
