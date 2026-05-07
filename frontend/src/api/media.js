import { API_BASE_URL } from "./client";
import { uploadFile } from "./util";

export const MediaApi = {
  getFullMediaUrl: id => `${API_BASE_URL}/media/${id}`,
  getThumbnailMediaUrl: id => `${API_BASE_URL}/media/${id}/thumbnail`,
  uploadMedia: file => uploadFile("/media", file),
};
