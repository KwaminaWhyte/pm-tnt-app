import axios from "axios";

const baseUrl = process.env.PM_TNT_API_BASE_URL;

export const bookHotelRoom = async (
  roomId: string,
  hotelId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
  token: string
) => {
  try {
    console.log({
      roomId,
      hotelId,
      checkIn,
      checkOut,
      guests,
      token,
    });

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
    console.error(JSON.stringify(error.response?.data, null, 2));
  }
};
