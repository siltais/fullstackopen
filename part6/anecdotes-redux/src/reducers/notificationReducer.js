import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState:'This is an initial message of the notification',
    reducers:{
      displayNotification(state, action) {
      return action.payload
    }
  }
})

export const { displayNotification } = notificationSlice.actions
export default notificationSlice.reducer