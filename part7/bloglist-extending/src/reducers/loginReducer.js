import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";

const loginSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = loginSlice.actions;

export const loginUser = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({
      username,
      password,
    });
    window.localStorage.setItem("loggedInUser", JSON.stringify(user));
    blogService.setToken(user.token);
    dispatch(setUser(user));
  };
};

export default loginSlice.reducer;
