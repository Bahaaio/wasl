import api from "./client";

export const getMedia = (id, thumbnail = false) => {
  const url = thumbnail ? `/media/${id}/thumbnail` : `/media/${id}`;
  return api.get(url, { responseType: "blob" }).then(res => res.data);
};

export const uploadFile = (url, file) => {
  const formData = new FormData();
  formData.append("file", file);

  // Ensure we don't send the instance default `application/json` header.
  // Setting Content-Type to `undefined` lets the browser set the correct
  // multipart/form-data boundary. Also increase timeout for larger files.
  return api
    .put(url, formData, {
      headers: { "Content-Type": undefined },
      timeout: 30000,
    })
    .then(res => res.data);
};
