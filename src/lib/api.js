import axios from "axios";

// Use Vite's env variables
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API,
});

export const getCourses = async () => {
  const { data } = await api.get("/courses");
  return Array.isArray(data) ? data : [];
};

export const getCourseBySlug = async (slug) => {
  const { data } = await api.get(`/courses/${slug}`);
  return data;
};

export const getExperts = async () => {
  const { data } = await api.get("/experts");
  return Array.isArray(data) ? data : [];
};

export const getExpertById = async (id) => {
  const { data } = await api.get(`/experts/${id}`);
  return data;
};

export const getSuccessStories = async () => {
  const { data } = await api.get("/success-stories");
  return Array.isArray(data) ? data : [];
};
