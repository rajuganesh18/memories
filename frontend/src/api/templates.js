import api from './client';

export const getTemplates = (theme) =>
  api.get('/templates', { params: theme ? { theme } : {} });

export const getTemplate = (id) => api.get(`/templates/${id}`);

// Admin endpoints
export const adminGetTemplates = () => api.get('/admin/templates');
export const adminCreateTemplate = (data) => api.post('/admin/templates', data);
export const adminUpdateTemplate = (id, data) =>
  api.put(`/admin/templates/${id}`, data);
export const adminDeleteTemplate = (id) =>
  api.delete(`/admin/templates/${id}`);

export const adminGetSizes = () => api.get('/admin/sizes');
export const adminCreateSize = (data) => api.post('/admin/sizes', data);

export const adminCreateTemplateSize = (data) =>
  api.post('/admin/template-sizes', data);
export const adminUpdateTemplateSize = (id, data) =>
  api.put(`/admin/template-sizes/${id}`, data);

export const adminUploadSampleImage = (templateId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/admin/templates/${templateId}/sample-images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const adminDeleteSampleImage = (templateId, imageId) =>
  api.delete(`/admin/templates/${templateId}/sample-images/${imageId}`);
