import { useAuth } from "./useAuth";

export default function useFetchProfile() {
    // console.log(token);

    const {token} = useAuth()

    const fetcher = (url) =>
      axios
        .get(url, {
          headers: {
            Authorization: "Bearer " + token.refreshToken,
          },
        })
        .then((res) => res.data);
      const { data, isLoading, error } = useSWR(
        "http://localhost:3001/auth/profile",
        fetcher
      );
     
      return {
        userProfile: data,
        isLoading: isLoading,
        error: error
      }
    }
  }