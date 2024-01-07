import axios from 'axios';
import useSWR from 'swr'
import { useAuth } from './useAuth';

export function useGradeReview(homeworkId){

    const {token} = useAuth();

    const fetcher = (url) => axios.get(url, {
        headers: {
            Authorization: "Bearer " + token?.refreshToken
        }
    }).then((res) => res.data);
    const {data, isLoading, error} = useSWR(`http://localhost:3001/gradeReview/h/${homeworkId}`, {
        fetcher
    })

    console.log(data)
    return {
        gradeReviews: data,
        isLoading: isLoading,
        error: error
    }
}