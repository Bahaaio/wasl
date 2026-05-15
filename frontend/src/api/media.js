import { API_BASE_URL } from "./client";
import { uploadFile } from "./util";

/** @typedef {import("./types").MediaUploadResponse} MediaUploadResponse */

export const MediaApi = {
  /**
   * @param {string} id
   * @returns {string}
   */
  getFullMediaUrl: id => `${API_BASE_URL}/media/${id}`,

  /**
   * @param {string} id
   * @returns {string}
   */
  getThumbnailMediaUrl: id => `${API_BASE_URL}/media/${id}/thumbnail`,

  /**
   * @param {File} file
   * @returns {Promise<MediaUploadResponse>}
   */
  uploadMedia: file => uploadFile("/media", file),
};
