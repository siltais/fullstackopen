import { createSlice } from '@reduxjs/toolkit'

const startMessage = {
    msg: '',
    style: 'none'
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState: startMessage,
    reducers:{
      displayNotification(state, action) {
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

export const { displayNotification,  clearNotification } = notificationSlice.actions
export default notificationSlice.reducer