import { useParams } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";

export function useClass(){
    const fetcher = (url) => axios.get(url).then((res) => res.data);
    const {id} = useParams()
    const {data, isLoading, error} = useSWR(`https://classmatebe-final.onrender.com/class/getClass/${id}`, fetcher)

    // console.log(data)
    //console.log(useParams())

    return {
        course: data,
        students: data?.members.filter(member => member.classes.some(cls => cls.classId._id === id && cls.role === '1000')),
        teachers: data?.members.filter(member => member.classes.some(cls => cls.classId._id === id && cls.role === '3000')),    
        isLoading: isLoading,
        isError: error
    }
}


