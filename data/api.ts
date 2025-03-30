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
export const getPackages = async (
  token?: string,
  params?: Record<string, any>
) => {
  const api = createApiInstance(token);
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
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    console.log(bookingData, token);

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

// Book a vehicle
interface VehicleBookingData {
  startDate: string;
  endDate: string;
  totalPrice: number;
  pickupLocation: {
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  dropoffLocation: {
    city: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  driverDetails?: {
    licenseNumber: string;
    expiryDate: string;
  };
  insuranceOption?: string;
}

export const bookVehicle = async (
  vehicleId: string,
  bookingData: VehicleBookingData,
  token: string
) => {
  try {
    if (!token) {
      throw new Error("Authentication required");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const response = await axios.post(
      `${BASE_URL}/vehicles/${vehicleId}/book`,
      bookingData,
      { headers }
    );
    return response;
  } catch (error) {
    console.error("Error booking vehicle:", error);
    throw error;
  }
};

// Package Templates API
export const getMyPackageTemplates = async (token?: string) => {
  console.log("token", token);

  try {
    const response = await axios.get(`${BASE_URL}/packages/templates/my`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log(response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching my package templates:", error);
    throw error;
  }
};

export const getPublicPackageTemplates = async (params?: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/packages/templates/public`, {
      params,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching public package templates:", error);
    throw error;
  }
};

export const getPackageTemplateById = async (id: string, token?: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/packages/templates/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching package template ${id}:`, error);
    throw error;
  }
};

// Define types for package template
export interface PackageTemplateData {
  name: string;
  description?: string;
  basePackageId: string;
  customizations: {
    accommodations?: {
      hotelIds?: string[];
      preferences?: {
        roomTypes?: string[];
        amenities?: string[];
        boardBasis?: string[];
        location?: string[];
      };
    };
    transportation?: {
      type?: "Flight" | "Train" | "Bus" | "Private Car" | "None";
      preferences?: {
        class?: string;
        seatingPreference?: string;
        specialAssistance?: string[];
        luggageOptions?: string[];
      };
    };
    activities?: {
      included?: string[];
      excluded?: string[];
      preferences?: {
        difficulty?: string[];
        duration?: string[];
        type?: string[];
        timeOfDay?: string[];
      };
    };
    meals?: {
      included?: {
        breakfast?: boolean;
        lunch?: boolean;
        dinner?: boolean;
      };
      preferences?: {
        dietary?: string[];
        cuisine?: string[];
        mealTimes?: {
          breakfast?: string;
          lunch?: string;
          dinner?: string;
        };
      };
    };
    itinerary?: {
      pace?: "Relaxed" | "Moderate" | "Fast";
      flexibility?: "Fixed" | "Flexible" | "Very Flexible";
      focusAreas?: string[];
      customDays?: Array<{
        day: number;
        title: string;
        description: string;
        activities: string[];
        meals?: {
          breakfast?: string;
          lunch?: string;
          dinner?: string;
        };
      }>;
    };
    accessibility?: {
      wheelchairAccess?: boolean;
      mobilityAssistance?: boolean;
      dietaryRestrictions?: string[];
      medicalRequirements?: string[];
    };
    budget?: {
      maxBudget?: number;
      priorityAreas?: string[];
      flexibleAreas?: string[];
    };
  };
  isPublic?: boolean;
  tags?: string[];
}

export const createPackageTemplate = async (
  templateData: PackageTemplateData,
  token?: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/packages/templates`,
      templateData,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    console.log("response", response.data);

    return response.data.data;
  } catch (error) {
    console.error("Error creating package template:", error);
    throw error;
  }
};

export const updatePackageTemplate = async (
  id: string,
  templateData: Partial<PackageTemplateData>,
  token?: string
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/packages/templates/${id}`,
      templateData,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error updating package template ${id}:`, error);
    throw error;
  }
};

export const deletePackageTemplate = async (id: string, token?: string) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/packages/templates/${id}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error deleting package template ${id}:`, error);
    throw error;
  }
};

export const submitPackageTemplateForReview = async (
  id: string,
  token?: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/packages/templates/${id}/submit`,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error submitting package template ${id} for review:`, error);
    throw error;
  }
};

export const checkPackageTemplateAvailability = async (
  id: string,
  date: string,
  participants: number,
  token?: string
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/packages/templates/${id}/availability`,
      {
        params: { date, participants },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error checking package template ${id} availability:`, error);
    throw error;
  }
};

// Admin API functions for Package Templates
export const getAllTemplatesForAdmin = async (params: any, token?: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/packages/admin/templates`, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all templates for admin:", error);
    throw error;
  }
};

export const approvePackageTemplate = async (
  id: string,
  feedback: string,
  token?: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/packages/templates/${id}/approve`,
      { feedback },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error approving package template ${id}:`, error);
    throw error;
  }
};

export const rejectPackageTemplate = async (
  id: string,
  feedback: string,
  token?: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/packages/templates/${id}/reject`,
      { feedback },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error rejecting package template ${id}:`, error);
    throw error;
  }
};

export const publishPackageTemplateAsPackage = async (
  id: string,
  token?: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/packages/templates/${id}/publish`,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Error publishing package template ${id} as package:`, error);
    throw error;
  }
};
