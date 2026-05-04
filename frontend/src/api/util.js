import api from "./client";

export const getMedia = (id, thumbnail = false) => {
  const url = thumbnail ? `/media/${id}/thumbnail` : `/media/${id}`;
  return api.get(url, { responseType: "blob" }).then(res => res.data);
};

export const uploadFile = (url, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .put(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(res => res.data);
};
