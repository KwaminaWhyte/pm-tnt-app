import axios from "axios";
import { BASE_URL, createApiInstance } from "./api";

export const fetcher = (token?: string) => async (url: string) => {
  try {
    // If the URL is already absolute (starts with http), use it directly
    // Otherwise, append it to BASE_URL if needed
    const fullUrl = url.startsWith("http")
      ? url
      : url.startsWith(BASE_URL)
      ? url
      : `${BASE_URL}${url}`;

    const api = createApiInstance(token);
    const response = await api.get(fullUrl);
    return response.data;
  } catch (error: any) {
    // Enhanced error handling
    console.error("API Error:", error?.response?.data || error.message);
    throw error;
  }
};
