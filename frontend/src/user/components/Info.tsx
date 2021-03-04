import React, {FC, useEffect, useState} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import useForm from 'react-captain/useForm'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'

import Fab from '../../common/components/Fab'
import Submit from '../../common/components/Submit'
import buildTextField from '../../common/components/TextField'
import buildSelect from '../../common/components/Select'
import {useAxios} from '../../async/hooks'
import {User} from '../model'

type Props = RouteComponentProps<{id: string}>

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(4, 0),
  },
  form: {
    margin: theme.spacing(2),
  },
  select: {
    marginTop: theme.spacing(4),
  },
}))

const CustomTextField = buildTextField<User>()
const CustomSelect = buildSelect<User>()

const Info: FC<Props> = props => {
  const id = Number(props.match.params.id)

  const axios = useAxios()
  const [user, setUser] = useState<User | null>(null)
  const {Form, useField} = useForm(user)
  const TextField = useField(CustomTextField)
  const Select = useField(CustomSelect)
  const classes = useStyles()

  function fetchUser() {
    const request = axios.get(`/users/${id}`)
    request(res => setUser(res.data))
  }

  async function update(user: User) {
    setUser(user)

    const request = axios.put(`/users/${id}`, user)
    await request(() => {
      props.history.push('/users')
      return 'User successfully updated!'
    })
  }

  async function remove() {
    const request = axios.delete(`/users/${id}`, user)
    await request(() => {
      props.history.push('/users')
      return 'User successfully deleted!'
    })
  }

  useEffect(fetchUser, [])

  if (!user) {
    return null
  }

  return (
    <Container>
      <Typography className={classes.title} variant="h3" component="h1">
        Edit user
      </Typography>
      <Form onSubmit={update} className={classes.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField name="first_name" label="First name" required={false} autoFocus />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="last_name" label="Last name" required={false} />
          </Grid>
          <Grid item xs={12}>
            <TextField name="email" label="Email" type="email" />
          </Grid>
          <Grid item xs={12}>
            <TextField name="password" label="Password" type="password" required={false} />
          </Grid>
          <Grid item xs={12}>
            <TextField name="confirm" label="Confirm Password" type="password" required={false} />
          </Grid>
          <Grid item xs={12} className={classes.select}>
            <Select name="role" label="Role">
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="flex-end">
              <Grid item>
                <Submit color="secondary" fullWidth={false}>
                  Submit
                </Submit>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Form>
      <Fab type="delete" onClick={remove} />
    </Container>
  )
}

export default Info
