import axios from "axios";
import { Linking } from "react-native";

export const BASE_URL =
  "http://i48g4kck48ksow4ssowws4go.138.68.103.18.sslip.io/api/v1";

// export const BASE_URL = "http://172.23.144.1.:3310/api/v1";

// Helper to create API instance with optional auth token
export const createApiInstance = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return axios.create({
    baseURL: BASE_URL,
    headers,
  });
};

// Hotel APIs
export const bookHotelRoom = async (
  roomId: string,
  hotelId: string,
  startDate: Date | string,
  endDate: Date | string,
  numberOfGuests: number,
  token: string
) => {
  const api = createApiInstance(token);
  return api.post("/bookings/hotel", {
    roomId,
    hotelId,
    startDate,
    endDate,
    numberOfGuests,
  });
};

// Favorites APIs
export const checkFavorite = async (
  itemId: string,
  type: "hotel" | "vehicle" | "package",
  token: string
) => {
  const api = createApiInstance(token);
  return api.get(`/favorites/check/${type}/${itemId}`);
};

export const toggleFavorite = async (
  itemId: string,
  type: "hotel" | "vehicle" | "package",
  token: string
) => {
  const api = createApiInstance(token);
  return api.post(`/favorites/${type}/${itemId}`);
};

// Sliders APIs
export const getSliders = async () => {
  const api = createApiInstance();
  return api.get("/sliders");
};

// Fetch hotels with optional params
export const getHotels = async (params?: Record<string, any>) => {
  const api = createApiInstance();
  return api.get("/hotels/public", { params });
};

// Fetch packages with optional params
export const getPackages = async (params?: Record<string, any>) => {
  const api = createApiInstance();
  return api.get("/packages", { params });
};

// PACKAGE BOOKING
interface PackageBookingData {
  packageId: string;
  startDate: string;
  participants: number;
  specialRequests?: string;
}

export const bookPackage = async (
  bookingData: PackageBookingData,
  token?: string
) => {
  try {
    if (!token) {
      throw new Error("Authentication required");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log(bookingData);

    const response = await axios.post(
      `${BASE_URL}/bookings/packages`,
      bookingData,
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error booking package:", error);
    throw error;
  }
};

// GET MY BOOKINGS
export const getMyBookings = async (
  status: string = "Confirmed,Pending",
  startDate?: string,
  endDate?: string,
  token?: string,
  bookingType: string = "all"
) => {
  try {
    if (!token) {
      throw new Error("Authentication required");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    let url = `${BASE_URL}/bookings/my-bookings?bookingType=${bookingType}`;
    if (status) url += `&status=${status}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    const response = await axios.get(url, { headers });
    return response;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

// GET MY NOTIFICATIONS
export const getMyNotifications = async (token?: string) => {
  try {
    if (!token) {
      throw new Error("Authentication required");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(`${BASE_URL}/notifications`, { headers });
    return response;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// MARK NOTIFICATION AS READ
export const markNotificationAsRead = async (
  notificationId: string,
  token?: string
) => {
  try {
    if (!token) {
      throw new Error("Authentication required");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.patch(
      `${BASE_URL}/notifications/${notificationId}/read`,
      {},
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// MARK ALL NOTIFICATIONS AS READ
export const markAllNotificationsAsRead = async (token?: string) => {
  try {
    if (!token) {
      throw new Error("Authentication required");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.patch(
      `${BASE_URL}/notifications/mark-all-read`,
      {},
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// WhatsApp Chat
export const openWhatsAppChat = async (
  phoneNumber: string = "+233245678901", // Default company number
  message: string = "Hello, I'm interested in your services."
) => {
  const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
    message
  )}`;
  const canOpen = await Linking.canOpenURL(url);

  if (canOpen) {
    return Linking.openURL(url);
  } else {
    const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    return Linking.openURL(webUrl);
  }
};

// Generic fetcher for SWR
export const fetcher = (token?: string) => async (url: string) => {
  const api = createApiInstance(token);
  const response = await api.get(url);
  return response.data;
};

// Get vehicle by ID
export const getVehicleById = async (id: string, token?: string) => {
  try {
    const headers: any = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(`${BASE_URL}/vehicles/public/${id}`, {
      headers,
    });
    return response;
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    throw error;
  }
};
