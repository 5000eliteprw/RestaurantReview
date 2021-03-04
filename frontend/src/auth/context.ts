import {Dispatch, SetStateAction, createContext, useContext} from 'react'
import noop from 'lodash/fp/noop'

import {AuthData} from '../user/model'

type State = AuthData | null
type Context = [State, Dispatch<SetStateAction<State>>]

export const AuthContext = createContext<Context>([null, noop])

function useAuthContext() {
  return useContext(AuthContext)
}

export default useAuthContext
