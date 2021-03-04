import React, {FC} from 'react'
import Button, {ButtonProps} from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'
import {useAsyncStateContext} from '../../async/context'

const useStyles = makeStyles(theme => ({
  button: {
    textTransform: 'none',
  },
}))

const CustomButton: FC<ButtonProps> = ({children, ...props}) => {
  const loading = useAsyncStateContext()
  const classes = useStyles()

  return (
    <Button
      type="submit"
      className={classes.button}
      fullWidth
      variant="contained"
      color="primary"
      size="large"
      disabled={loading}
      {...props}
    >
      {children}
    </Button>
  )
}

export default CustomButton
