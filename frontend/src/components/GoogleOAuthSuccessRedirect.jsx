import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { setAuthTokens } from '../redux/authSlice';

const GoogleOAuthSuccessRedirect = () => {

    let { accessToken, refreshToken, from } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (from && accessToken && refreshToken) {
            dispatch(setAuthTokens({ accessToken, refreshToken }))
            navigate('/' + from, { replace: true });
        }
    }, [accessToken, dispatch, from, navigate, refreshToken])


    return (
        <div>Loading...</div>
    )
}

export default GoogleOAuthSuccessRedirect