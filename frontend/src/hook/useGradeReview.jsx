import axios from "axios";
import { useParams } from "react-router-dom";
import useSWR from "swr";

export function useGradeReview() {
  const { homeworkId } = useParams();
  console.log(homeworkId)

  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const { data, isLoading, error } = useSWR(
    `http://localhost:3001/gradeReview/h/${homeworkId}`,
    fetcher
  );

  return {
    gradeReviews: data,
    isLoading: isLoading,
    error: error,
  };
}
