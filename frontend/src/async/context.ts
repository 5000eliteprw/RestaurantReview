import {createContext, useContext} from 'react'
import noop from 'lodash/fp/noop'

type AsyncStateContext = boolean
type AsyncDispatchContext = {
  start: () => void
  stop: (message?: string | void) => void
}

export const AsyncStateContext = createContext(false)
export const AsyncDispatchContext = createContext({start: noop, stop: noop})

export const useAsyncStateContext = () => useContext(AsyncStateContext)
export const useAsyncDispatchContext = () => useContext(AsyncDispatchContext)
