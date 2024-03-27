import { createSlice } from '@reduxjs/toolkit'

const startMessage = {
    msg: '',
    style: 'none'
}

let theTimer

const notificationSlice = createSlice({
    name: 'notification',
    initialState: startMessage,
    reducers:{
      setNotification(state, action) {
        const msgToDisplay = {
          msg: action.payload,
          style: ''
        }
        return msgToDisplay
      },
      clearNotification() {
        return startMessage
      }
    }
})

export const { clearNotification, setNotification } = notificationSlice.actions

export const displayNotification = (msg, secondsToShow) => {
  if(theTimer !== undefined) {
    clearTimeout(theTimer)
  }
  return dispatch  => {
    dispatch(setNotification(msg))
    theTimer = setTimeout(() => {
      dispatch(clearNotification())
    }, secondsToShow * 1000)   
  }
}



export default notificationSlice.reducer