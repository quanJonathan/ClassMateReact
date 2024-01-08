import axios from "axios";
import { useAuth } from "./useAuth";
import useSWR from 'swr'

export default function useFetchProfile(token) {
  // console.log(token);

  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + token.refreshToken,
        },
      })
      .then((res) => res.data);
      
  const { data, isLoading, error } = useSWR(
    "https://classmatebe-final.onrender.com/auth/profile",
    fetcher
  );

  return {
    userProfile: data,
    isLoading: isLoading,
    error: error,
  };
}
