import  counterSlice  from '@/reduser/counterSlice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    counter:counterSlice
  },
})