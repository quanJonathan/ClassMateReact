import useSWR from "swr";
import { useAuth } from "./useAuth";
import axios from "axios";

export function useNotification() {
  const { user, token } = useAuth();


  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + token?.refreshToken,
        },
      })
      .then((res) => res.data);

  const { data, isLoading, error } = useSWR(
    `https://classmatebe-final.onrender.com/notification/u/${user?._id}`,
    fetcher
  );
  return {
    notifications: data,
    isLoading,
    error,
  };
}
