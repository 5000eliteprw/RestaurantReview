import 'react-datepicker/dist/react-datepicker.css'

import React, {FC, Fragment} from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import {makeStyles} from '@material-ui/core/styles'

import AppBar from './AppBar'
import AsyncProvider from '../../async/provider'
import AuthProvider from '../../auth/provider'
import Login from '../../auth/components/Login'
import PrivateRoute from '../../auth/components/PrivateRoute'
import Register from '../../auth/components/Register'
import RestaurantInfo from '../../restaurant/components/Info'
import RestaurantList from '../../restaurant/components/List'
import RestaurantEdit from '../../restaurant/components/Edit'
import PendingReviewList from '../../review/components/PendingList'
import ReviewEdit from '../../review/components/Edit'
import ReviewReply from '../../review/components/Reply'
import UserList from '../../user/components/List'
import UserInfo from '../../user/components/Info'
import {SnackbarProvider} from 'notistack'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.grey[100],
    },
    '.react-datepicker-popper': {
      zIndex: 2,
    },
    '.react-datepicker-wrapper, .react-datepicker__input-container': {
      width: '100%',
    },
  },
}))

const App: FC = () => {
  useStyles()

  return (
    <Fragment>
      <SnackbarProvider maxSnack={2}>
        <CssBaseline />
        <AsyncProvider>
          <AuthProvider>
            <Router>
              <AppBar />
              <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <PrivateRoute path="/restaurants/create" component={RestaurantEdit} />
                <PrivateRoute path="/restaurants/:id/edit" component={RestaurantEdit} />
                <PrivateRoute path="/restaurants/:id" component={RestaurantInfo} />
                <PrivateRoute exact path="/restaurants" component={RestaurantList} />
                <PrivateRoute exact path="/reviews/:id/edit" component={ReviewEdit} />
                <PrivateRoute exact path="/reviews/:id/reply" component={ReviewReply} />
                <PrivateRoute exact path="/reviews" component={PendingReviewList} />
                <PrivateRoute exact path="/users" component={UserList} />
                <PrivateRoute exact path="/users/:id" component={UserInfo} />
                <Redirect to="/restaurants" />
              </Switch>
            </Router>
          </AuthProvider>
        </AsyncProvider>
      </SnackbarProvider>
    </Fragment>
  )
}

export default App
