import { createSlice } from "@reduxjs/toolkit"
import { strToBool} from "../helpers/strToBool"

const initState = {
  accessToken: null,
  refreshToken: strToBool(localStorage.getItem("persist"))
    ? localStorage.getItem("rT") === "null"
      ? null
      : localStorage.getItem("rT")
    : null,
  persist: strToBool(localStorage.getItem("persist")) || false
}

const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    setAuthTokens: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },
    setPersist: (state, action) => {
      state.persist = action.payload
    }
  }
})

export const { setAuthTokens, setPersist } = authSlice.actions

export default authSlice.reducer

export const selectAuthState = state => state.auth
export const selectCurrentAccessToken = state => state.auth.accessToken
export const selectCurrentRefreshToken = state => state.auth.refreshToken
