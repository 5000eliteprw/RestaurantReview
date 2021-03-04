import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import isNull from 'lodash/fp/isNull'

import useAuthContext from '../../auth/context'
import { useAxios } from '../../async/hooks'
import Fab from '../../common/components/Fab'
import Rating from '../../common/components/Rating'
import { Restaurant } from '../model'
import { emptyUser } from '../../user/model'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(4, 0),
  },
  media: {
    height: 140,
  },
  select: {
    marginBottom: theme.spacing(4),
  },
  slider: {},
}))

const marks = [
  {
    value: -1,
    label: 'n/a',
  },
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
]

const RestaurantList: FC<RouteComponentProps> = props => {
  const classes = useStyles()
  const axios = useAxios()
  const { enqueueSnackbar } = useSnackbar()

  const [authData] = useAuthContext()
  let user = authData ? authData.user : emptyUser

  const [ownerId, setOwnerId] = useState<number | null>(-1)
  const [minRating, setMinRating] = useState<number | null>(null)
  const [maxRating, setMaxRating] = useState<number | null>(null)

  const [restaurants, setRestaurants] = useState<Restaurant[] | null>(null)

  const [rating, setRating] = React.useState([-1, 5])
  const onRatingChange = (event: React.ChangeEvent<{}>, value: number | number[]) => {
    let rating = value as number[]
    setRating(rating)
    setMinRating(rating[0])
    setMaxRating(rating[1])
  }

  useEffect(() => {
    if (user.role === 'owner') {
      setOwnerId(user.id)
    } else {
      setOwnerId(null)
    }
  }, [user])

  function show(id: number) {
    return () => props.history.push(`/restaurants/${id}`)
  }

  function fetchRestaurants(
    owner_id: number | null,
    min_rating: number | null,
    max_rating: number | null,
  ): void {
    const request = axios.get('/restaurants', { owner_id, min_rating, max_rating })
    request(res => {
      if (res.data instanceof Array) {
        let restaurants = res.data as Restaurant[]

        setRestaurants(restaurants)
      } else {
        enqueueSnackbar('Invalid restaurants response', {
          variant: 'warning',
        })
      }
    })
  }

  useEffect(() => {    
    if (ownerId == null || ownerId > 0) fetchRestaurants(ownerId, minRating, maxRating)
  }, [ownerId, minRating, maxRating]) // eslint-disable-line react-hooks/exhaustive-deps

  if (isNull(restaurants) || !user) {
    return null
  }

  const canCreateRestaurant = user.role === 'owner'

  return (
    <Container>
      <Typography className={classes.title} variant="h3" component="h1">
        Restaurants
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Slider
            color="secondary"
            className={classes.slider}
            value={rating}
            onChange={onRatingChange}
            min={-1}
            max={5}
            track={false}
            marks={marks}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {restaurants.map(restaurant => (
          <Grid key={restaurant.id} item xs={4}>
            <Card onClick={show(restaurant.id)}>
              <CardActionArea>
                <CardHeader title={restaurant.name} />

                <CardMedia
                  className={classes.media}
                  image={restaurant.background_image_url}
                  title={restaurant.name}
                />
                <Rating rating={restaurant.avg_rating} />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {canCreateRestaurant && <Fab type="create" to="/restaurants/create" />}
    </Container>
  )
}

export default RestaurantList
