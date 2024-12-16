import axios from "axios";
import Toast from "react-native-toast-message";

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const bookHotelRoom = async (
  roomId: string,
  hotelId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  token: string
) => {
  try {
    const response = await axios.post(
      `${baseUrl}/hotels/public/${hotelId}/book`,
      {
        roomId,
        checkIn,
        checkOut,
        guests,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error: any) {
    Toast.show({
      type: "error",
      text1: "Unexpected Error",
      text2: "Something went wrong",
    });
    console.error(JSON.stringify(error.response?.data, null, 2));
  }
};
