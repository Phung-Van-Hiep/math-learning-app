import api from './api';

const geogebraService = {
  async create(data) { return (await api.post('/geogebra/', data)).data; },
  async getByLesson(lessonId) { return (await api.get(`/geogebra/lesson/${lessonId}`)).data; },
  async getById(id) { return (await api.get(`/geogebra/${id}`)).data; },
  async update(id, data) { return (await api.put(`/geogebra/${id}`, data)).data; },
  async delete(id) { await api.delete(`/geogebra/${id}`); }
};
export default geogebraService;