import api from "./client";

/** @typedef {import("./types").MediaUploadResponse} MediaUploadResponse */

/**
 * @param {string} url
 * @param {File} file
 * @returns {Promise<MediaUploadResponse>}
 */
export const uploadPost = async (url, file) => upload("post", url, file);

/**
 * @param {string} url
 * @param {File} file
 * @returns {Promise<MediaUploadResponse>}
 */
export const uploadPut = async (url, file) => upload("put", url, file);

/**
 * @param {"post" | "put"} method
 * @param {string} url
 * @param {File} file
 * @returns {Promise<MediaUploadResponse>}
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
