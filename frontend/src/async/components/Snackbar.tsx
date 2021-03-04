import React, {useEffect, useState} from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import {makeStyles} from '@material-ui/core/styles'
import classNames from 'classnames'
import isEmpty from 'lodash/fp/isEmpty'

type Props = {
  message: string
  onClose: () => void
}

const useStyles = makeStyles(theme => ({
  snackbar: {
    cursor: 'pointer',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
}))

export default function(props: Props) {
  const {message, onClose: handleExited} = props
  const [open, setOpen] = useState(false)
  const classes = useStyles()

  function close(_: any, reason?: string) {
    if (reason !== 'clickaway') {
      setOpen(false)
    }
  }

  const className = classNames(classes.snackbar, {
    [classes.error]: message.match(/^Error/),
  })

  useEffect(() => {
    if (!isEmpty(message)) {
      setOpen(true)
    }
  }, [message])

  return (
    <Snackbar
      anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
      autoHideDuration={2000}
      onClick={close}
      onClose={close}
      onExited={handleExited}
      open={open}
    >
      <SnackbarContent message={message} className={className} />
    </Snackbar>
  )
}
