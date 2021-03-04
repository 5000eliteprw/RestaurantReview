import React, {FC, useRef, useState} from 'react'

import Snackbar from './components/Snackbar'
import {AsyncStateContext, AsyncDispatchContext} from './context'

const AsyncProvider: FC = props => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useRef({start, stop})

  function start() {
    setLoading(true)
  }

  function stop(nextMessage?: string | void) {
    setLoading(false)

    if (!message && nextMessage) {
      setMessage(nextMessage || '')
    }
  }

  function close() {
    setMessage('')
  }

  return (
    <AsyncStateContext.Provider value={loading}>
      <AsyncDispatchContext.Provider value={dispatch.current}>
        <Snackbar message={message} onClose={close} />
        {props.children}
      </AsyncDispatchContext.Provider>
    </AsyncStateContext.Provider>
  )
}

export default AsyncProvider
