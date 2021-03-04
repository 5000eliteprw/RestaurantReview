import React, {FC, useEffect, useState} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import useForm from 'react-captain/useForm'
import {makeStyles} from '@material-ui/core/styles'

import {useAxios} from '../../async/hooks'
import Fab from '../../common/components/Fab'
import useAuthContext from '../../auth/context'
import Submit from '../../common/components/Submit'
import buildTextField from '../../common/components/TextField'
import {Restaurant, emptyRestaurant} from '../model'
import {emptyUser} from '../../user/model'

type Props = RouteComponentProps<{id: string}>

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(4, 0),
  },
}))

const CustomTextField = buildTextField<Restaurant>()

const RestaurantEdit: FC<Props> = props => {
  const id = Number(props.match.params.id)

  const axios = useAxios()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [authData] = useAuthContext()
  let user = authData ? authData.user : emptyUser

  const {Form, useField} = useForm(restaurant)
  const TextField = useField(CustomTextField)
  const classes = useStyles()

  function fetchRestaurant() {
    if (id) {
      const request = axios.get(`/restaurants/${id}`)
      request(res => {
        console.log('Restaurant: ', res.data)
        setRestaurant(res.data)
      })
    } else {
      setRestaurant(emptyRestaurant)
    }
  }

  async function create(restaurant: Restaurant) {
    setRestaurant(restaurant)

    const request = axios.post('/restaurants', {...restaurant, owner: null, owner_id: user.id})
    await request(() => {
      props.history.push('/restaurants')
      return 'Restaurant successfully created!'
    })
  }

  async function update(restaurant: Restaurant) {
    setRestaurant(restaurant)

    const request = axios.put(`/restaurants/${id}`, {...restaurant, owner: null, owner_id: user.id})
    await request(() => {
      props.history.push('/restaurants')
      return 'Restaurant successfully updated!'
    })
  }

  async function remove() {
    const request = axios.delete(`/restaurants/${id}`)
    await request(() => {
      props.history.push('/restaurants')
      return 'Restaurant successfully deleted!'
    })
  }

  useEffect(fetchRestaurant, [])

  if ((id && !restaurant) || !user) {
    return null
  }

  const canDeleteRestaurant = user.role === 'admin'

  return (
    <Container>
      <Typography className={classes.title} variant="h5" component="h2">
        {id ? 'Update' : 'Add'} restaurant
      </Typography>

      <Form onSubmit={id ? update : create}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField autoFocus name="name" label="Name" />
          </Grid>
          <Grid item xs={12}>
            <TextField name="background_image_url" label="Restaurant Image URL" required={false} />
          </Grid>
          <Grid item xs={12}>
            <Grid container justify="flex-end">
              <Grid item>
                <Submit color="secondary" fullWidth={false}>
                  {id ? 'Update' : 'Add'}
                </Submit>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Form>

      {canDeleteRestaurant && <Fab type="delete" onClick={remove} />}
    </Container>
  )
}

export default withRouter(RestaurantEdit)
