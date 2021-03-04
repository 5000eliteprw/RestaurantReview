import React, {FC} from 'react'
import LinearProgress from '@material-ui/core/LinearProgress'
import MUIAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'

import {useAsyncStateContext} from '../../async/context'
import Link from '../../common/components/Link'
import AppBarMenu from './AppBarMenu'
import useAuthContext from '../../auth/context'

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
  },
  user: {
    marginLeft: '10px',
    fontStyle: 'italic',
    color: 'lightGray',
  },
  title: {
    flex: 1,
    color: theme.palette.common.white,
    '&:hover': {
      textDecoration: 'none',
    },
  },
  loader: {
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
}))

const AppBar: FC = () => {
  const loading = useAsyncStateContext()
  const classes = useStyles()

  const [authData] = useAuthContext()
  let user = authData ? authData.user : null

  return (
    <MUIAppBar position="static" color="primary" className={classes.container}>
      <Toolbar>
        <Link className={classes.title} to="/restaurants">
          <Typography variant="h5" color="inherit">
            Restaurant Reviews
          </Typography>
        </Link>
        <AppBarMenu />
        <Typography variant="subtitle1" className={classes.user}>
          {user ? user.role : null}
        </Typography>
      </Toolbar>
      {loading && <LinearProgress className={classes.loader} />}
    </MUIAppBar>
  )
}

export default AppBar
