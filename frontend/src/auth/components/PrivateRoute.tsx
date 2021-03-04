import React, {FC} from 'react'
import {Route, RouteProps, Redirect} from 'react-router-dom'

import useAuthContext from '../context'

const PrivateRoute: FC<RouteProps> = props => {
  const [authData] = useAuthContext()
  let user = authData ? authData.user : null

  return user ? <Route {...props} /> : <Redirect to="/login" />
}

export default PrivateRoute
