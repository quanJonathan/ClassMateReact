import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';

const GoogleOAuthSuccessRedirect = ({props}) => {

    let { accessToken, refreshToken, from} = useParams();
    const {setToken} = useAuth();
    const navigate = useNavigate();
    //const dispatch = useAppDispatch()

    console.log("accessToken" + accessToken)
    console.log("freshToken" + refreshToken)
    console.log("from" + from)

    useEffect(() => {
        if ( accessToken && refreshToken) {
            //dispatch(setAuthTokens({ accessToken, refreshToken }))
            const token = {
                accessToken: accessToken,
                refreshToken: refreshToken
            }
            setToken(token)
            localStorage.setItem('token', JSON.stringify(token));
            navigate('/dashboard', { replace: true })     
        }
    }, [accessToken, from, navigate, refreshToken, setToken])


    return (
        <div>Loading...</div>
    )
}

export default GoogleOAuthSuccessRedirect