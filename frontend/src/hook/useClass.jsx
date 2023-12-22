import { useAuth } from "./useAuth";

export function useClass({id}){

    const {data, isLoading, Error} = useSWR(`http://localhost:3001/getClass/${_id}`)

    return {
        classObject: data,
        isLoading: isLoading,
        isError: Error
    }
}