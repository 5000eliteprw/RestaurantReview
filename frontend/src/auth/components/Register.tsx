import React, {FC} from 'react'
import Avatar from '@material-ui/core/Avatar'
import Container from '@material-ui/core/Container'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Logo from '@material-ui/icons/Message'
import Paper from '@material-ui/core/Paper'
import Switch, {SwitchProps} from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import useForm, {FieldComponent} from 'react-captain/useForm'
import {InputLabelProps} from '@material-ui/core/InputLabel'
import {OutlinedInputProps} from '@material-ui/core/OutlinedInput'
import {makeStyles} from '@material-ui/core/styles'

import {useAxios} from '../../async/hooks'
import {User, emptyUser} from '../../user/model'
import Link from '../../common/components/Link'
import Submit from '../../common/components/Submit'
import buildTextField from '../../common/components/TextField'

const CustomTextField = buildTextField<User>()
const CustomSwitch: FieldComponent<User, 'owner' | 'user', SwitchProps> = props => (
  <FormControlLabel
    control={
      <Switch
        checked={props.value === 'owner'}
        onChange={({target}) => props.onChange(target.checked ? 'owner' : 'user')}
        color="secondary"
      />
    }
    label={props.label}
  />
)

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
    backgroundColor: theme.palette.secondary.light,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  inputRoot: {},
  inputFocused: {},
  labelRoot: {
    '&$labelFocused': {
      color: theme.palette.secondary.main,
    },
  },
  labelFocused: {},
}))

const Register: FC = () => {
  const axios = useAxios()
  const {Form, useField} = useForm(emptyUser)
  const TextField = useField(CustomTextField)
  const Switch = useField(CustomSwitch)
  const classes = useStyles()

  const inputProps: Partial<OutlinedInputProps> = {
    classes: {
      root: classes.inputRoot,
      focused: classes.inputFocused,
    },
  }

  const inputLabelProps: InputLabelProps = {
    classes: {
      root: classes.labelRoot,
      focused: classes.labelFocused,
    },
  }

  function register(user: User) {
    const request = axios.post('/auth/register', user)
    return request(() => {
      window.location.assign('/login')
      return 'Successfully registered'
    })
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={4}>
        <Avatar className={classes.avatar}>
          <Logo />
        </Avatar>
        <Typography component="h2" variant="h5">
          Register
        </Typography>
        <Form className={classes.form} onSubmit={register}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="first_name"
                label="First name"
                InputProps={inputProps}
                InputLabelProps={inputLabelProps}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="last_name"
                label="Last name"
                InputProps={inputProps}
                InputLabelProps={inputLabelProps}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                InputProps={inputProps}
                InputLabelProps={inputLabelProps}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Password"
                type="password"
                InputProps={inputProps}
                InputLabelProps={inputLabelProps}
              />
              <TextField
                name="confirm"
                label="Confirm Password"
                type="password"
                InputProps={inputProps}
                InputLabelProps={inputLabelProps}
              />
            </Grid>
            <Grid item xs={12}>
              <Switch name="role" label="I own a restaurant" />
            </Grid>
          </Grid>
          <Submit className={classes.submit} color="secondary">
            Register
          </Submit>
          <Grid container justify="center">
            <Grid item>
              <Link to="/login">Log in</Link>
            </Grid>
          </Grid>
        </Form>
      </Paper>
    </Container>
  )
}

export default Register
