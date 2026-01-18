import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const practitionerService = {
  getAll: () => api.get('/practitioners'),
  getVerified: () => api.get('/practitioners/verified'),
  getUnverified: () => api.get('/practitioners/unverified'),
  getByUserId: (userId) => api.get(`/practitioners/user/${userId}`),
  getBySpecialization: (specialization) => api.get(`/practitioners/specialization/${specialization}`),
  create: (data) => api.post('/practitioners', data),
  verify: (id) => api.put(`/practitioners/${id}/verify`),
  adminVerify: (data) => api.post('/practitioners/admin/verify', data),
};

export const sessionService = {
  book: (data) => api.post('/sessions', data),
  getUserSessions: (userId) => api.get(`/sessions/user/${userId}`),
  getPractitionerSessions: (practitionerId) => api.get(`/sessions/practitioner/${practitionerId}`),
  updateStatus: (id, status) => api.put(`/sessions/${id}/status?status=${status}`),
};

export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  getAvailable: () => api.get('/products/available'),
  create: (data) => api.post('/products', data),
};

export const orderService = {
  create: (data) => api.post('/orders', data),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status?status=${status}`),
};

export const reviewService = {
  create: (data) => api.post('/reviews', data),
  getPractitionerReviews: (practitionerId) => api.get(`/reviews/practitioner/${practitionerId}`),
  getAverageRating: (practitionerId) => api.get(`/reviews/practitioner/${practitionerId}/average`),
};

export const communityService = {
  createQuestion: (data) => api.post('/community/questions', data),
  getAllQuestions: () => api.get('/community/questions'),
  createAnswer: (data) => api.post('/community/answers', data),
  getQuestionAnswers: (questionId) => api.get(`/community/questions/${questionId}/answers`),
};

export const recommendationService = {
  generate: (data) => api.post('/recommendations', data),
  getUserRecommendations: (userId) => api.get(`/recommendations/user/${userId}`),
};

export const notificationService = {
  getUserNotifications: (userId) => api.get(`/notifications/user/${userId}`),
  getUnreadNotifications: (userId) => api.get(`/notifications/user/${userId}/unread`),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export const paymentService = {
  processPayment: (data) => api.post('/payments/process', data),
};

export default api;
