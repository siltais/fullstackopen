import { createSlice } from "@reduxjs/toolkit";

const startMessage = {
  msg: "",
  style: "none",
  msgFormat: "",
};

let theTimer;

const notificationSlice = createSlice({
  name: "notification",
  initialState: startMessage,
  reducers: {
    setNotification(state, action) {
      const msgToDisplay = {
        msg: action.payload.msg,
        style: "",
        msgFormat: action.payload.msgFormat,
      };
      return msgToDisplay;
    },
    clearNotification() {
      return startMessage;
    },
  },
});

export const { clearNotification, setNotification } = notificationSlice.actions;

export const displayNotification = (msgFormat, msg, secondsToShow) => {
  if (theTimer !== undefined) {
    clearTimeout(theTimer);
  }
  return (dispatch) => {
    dispatch(setNotification({ msgFormat: msgFormat, msg: msg }));
    theTimer = setTimeout(() => {
      dispatch(clearNotification());
    }, secondsToShow * 1000);
  };
};

export default notificationSlice.reducer;
