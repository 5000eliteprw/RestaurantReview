import React, {FC, Fragment} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles'

import Link from '../../common/components/Link'
import useAuthContext from '../../auth/context'

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.common.white,
    '&:hover': {
      textDecoration: 'none',
    },
  },
}))

const AppBarMenu: FC<RouteComponentProps> = props => {
  const [authData, setAuthData] = useAuthContext()
  let user = authData ? authData.user : null

  const classes = useStyles()

  function logout() {
    setAuthData(null)
    props.history.push('/login')
  }

  if (user == null) {
    return null
  }

  const hasReviewRights = user.role === 'owner'
  const hasAllRights = user.role === 'admin'

  return (
    <Fragment>
      {hasAllRights && (
        <Link className={classes.link} to="/users">
          <Button variant="text" color="inherit">
            Users
          </Button>
        </Link>
      )}
      {hasReviewRights && (
        <Link className={classes.link} to="/reviews">
          <Button variant="text" color="inherit">
            Pending reviews
          </Button>
        </Link>
      )}
      <Link className={classes.link} to="/restaurants">
        <Button variant="text" color="inherit">
          Restaurants
        </Button>
      </Link>
      <Button className={classes.link} onClick={logout} variant="text">
        Logout
      </Button>
    </Fragment>
  )
}

export default withRouter(AppBarMenu)
