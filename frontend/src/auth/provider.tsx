import React, {FC, useEffect, useState} from 'react'

import {AuthData} from '../user/model'
import {AuthContext} from './context'
import {setApiToken} from '../utils/axios'

const AuthProvider: FC = props => {
  let savedAuthData = localStorage.getItem('auth-data')
  let savedAuthObj = null
  if (savedAuthData != null) {
    savedAuthObj = JSON.parse(savedAuthData)
    setApiToken(savedAuthObj.access)
  }
  const [authData, setAuthData] = useState<AuthData | null>(savedAuthObj)

  useEffect(() => {
    if (authData == null) {
      localStorage.removeItem('auth-data')
    } else {
      localStorage.setItem('auth-data', JSON.stringify(authData))
      setApiToken(authData.access)
    }
  }, [authData])

  return (
    <AuthContext.Provider value={[authData, setAuthData]}>{props.children}</AuthContext.Provider>
  )
}

export default AuthProvider
