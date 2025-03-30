export interface PackageType {
  _id: string;
  name: string;
  description?: string;
  images?: string[];
  duration?: {
    days: number;
    nights: number;
  };
  price?: number;
  maxParticipants?: number;
  status?: string;
}

export type PaceType = "Relaxed" | "Moderate" | "Fast";
export type FlexibilityType = "Fixed" | "Flexible" | "Very Flexible";
export type TransportationType =
  | "Flight"
  | "Train"
  | "Bus"
  | "Private Car"
  | "None";

export interface TransportationPreferences {
  types?: string[];
  class?: string;
  specialRequirements?: string[];
  seatingPreference?: string;
  specialAssistance?: string[];
  luggageOptions?: string[];
}

export interface TransportationCustomization {
  type?: TransportationType;
  preferences?: TransportationPreferences;
}

export interface ActivitiesPreferences {
  difficulty?: string[];
  duration?: string[];
  activityTypes?: string[];
  timeOfDay?: string[];
}

export interface ActivitiesType {
  included: string[];
  excluded: string[];
  preferences: ActivitiesPreferences;
}

export interface MealsType {
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
}

export interface ItineraryType {
  pace?: PaceType;
  flexibility?: FlexibilityType;
  focusAreas?: string[];
  dayRequirements?: string[];
}

export interface AccessibilityType {
  wheelchairAccess?: boolean;
  mobilityAssistance?: boolean;
  dietaryRestrictions?: string[];
  medicalRequirements?: string[];
}

export interface BudgetType {
  maxBudget?: number;
  priorityAreas?: string[];
  flexibleAreas?: string[];
}

export interface AccommodationsType {
  hotelIds?: string[];
  preferences?: {
    roomTypes?: string[];
    amenities?: string[];
    boardBasis?: string[];
    location?: string[];
  };
}

export interface CustomizationsType {
  activities: ActivitiesType;
  meals?: MealsType;
  itinerary?: ItineraryType;
  accommodations?: AccommodationsType;
  transportation?: TransportationCustomization;
  accessibility?: AccessibilityType;
  budget?: BudgetType;
}

export interface FormData {
  name: string;
  description: string;
  basePackageId: string;
  customizations: CustomizationsType;
  isPublic: boolean;
  tags: string[];
}
