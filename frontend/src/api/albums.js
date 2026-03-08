import api from './client';

export const createAlbum = (data) => api.post('/albums', data);
export const getAlbums = () => api.get('/albums');
export const getAlbum = (id) => api.get(`/albums/${id}`);

export const uploadPhoto = (albumId, file, pageNumber, position) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('page_number', pageNumber);
  formData.append('position', position);
  return api.post(`/albums/${albumId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deletePhoto = (albumId, photoId) =>
  api.delete(`/albums/${albumId}/photos/${photoId}`);

export const completeAlbum = (albumId) =>
  api.put(`/albums/${albumId}/complete`);
