import axios from "axios";

export const fetcher = (token?: string) => async (url: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error: any) {
    // console.log(
    //   JSON.stringify(
    //     {
    //       message: error.message,
    //       code: error.code,
    //       status: error.status,
    //       response: error,
    //     },
    //     null,
    //     2
    //   )
    // );
    return;

    // alert(error.message)
  }
};
