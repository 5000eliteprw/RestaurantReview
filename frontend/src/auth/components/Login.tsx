import React, {FC} from 'react'
import {RouteComponentProps, Redirect} from 'react-router-dom'
import useForm from 'react-captain/useForm'
import Avatar from '@material-ui/core/Avatar'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Logo from '@material-ui/icons/Message'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'

import Link from '../../common/components/Link'
import Submit from '../../common/components/Submit'
import {useAxios} from '../../async/hooks'
import buildTextField from '../../common/components/TextField'
import useAuthContext from '../../auth/context'
import {User, emptyUser} from '../../user/model'

type Props = RouteComponentProps<{token: string}>

const CustomTextField = buildTextField<User>()

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.light,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const Login: FC<Props> = props => {
  const axios = useAxios()
  const [, setAuthData] = useAuthContext()
  let user = null

  const {Form, useField} = useForm(emptyUser)
  const TextField = useField(CustomTextField)
  const classes = useStyles()

  function login(user: User) {
    const payload = {email: user.email, password: user.password}
    const request = axios.post('/auth/login', payload)
    return request(res => {
      setAuthData(res.data)
      props.history.push('/restaurants')
    })
  }

  if (user) return <Redirect to="/restaurants" />

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={4}>
        <Avatar className={classes.avatar}>
          <Logo />
        </Avatar>
        <Typography component="h2" variant="h5">
          Log in
        </Typography>
        <Form className={classes.form} onSubmit={login}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField name="email" label="Email" type="email" autoFocus />
            </Grid>
            <Grid item xs={12}>
              <TextField name="password" label="Password" type="password" />
            </Grid>
          </Grid>
          <Submit className={classes.submit}>Log in</Submit>
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid item>
              <Link to="/register">Create an account</Link>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </Container>
  )
}

export default Login
