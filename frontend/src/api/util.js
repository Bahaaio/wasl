import api from "./client";

/** @typedef {import("./types").UploadResponse} UploadResponse */

/**
 * @param {string} url
 * @param {File} file
 * @returns {Promise<UploadResponse>}
 */
export const uploadFile = async (url, file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Ensure we don't send the instance default `application/json` header.
  // Setting Content-Type to `undefined` lets the browser set the correct
  // multipart/form-data boundary. Also increase timeout for larger files.
  const res = await api.put(url, formData, {
    headers: { "Content-Type": undefined },
    timeout: 30000,
  });

  return res.data;
};
