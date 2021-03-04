import React, {FC, useEffect, useState} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import isNil from 'lodash/fp/isNil'
import orderBy from 'lodash/fp/orderBy'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import {green} from '@material-ui/core/colors'
import Fab from '../../common/components/Fab'
import useAuthContext from '../../auth/context'
import ReviewCreate from '../../review/components/Create'
import ReviewList from '../../review/components/List'
import {useAxios} from '../../async/hooks'
import {Restaurant} from '../model'
import {emptyUser} from '../../user/model'
import _ from 'lodash'
import Rating from '../../common/components/Rating'

type Props = RouteComponentProps<{id: string}>

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(4, 0, 0, 0),
  },
  summary: {
    backgroundColor: green[50],
    marginTop: theme.spacing(1),

    display: 'flex',
  },
  summaryDetail: {
    flex: 1,
  },
  summaryItem: {
    display: 'flex',
  },
  summaryImage: {
    flex: 1,
  },
  subtitle: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },

  summaryRating: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
}))

const Info: FC<Props> = props => {
  const id = Number(props.match.params.id)

  const axios = useAxios()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [authData] = useAuthContext()
  let user = authData ? authData.user : emptyUser

  const classes = useStyles()

  function fetchRestaurant() {
    const request = axios.get(`/restaurants/${id}`)
    request(res => {
      console.log(res.data)
      setRestaurant(res.data)
    })
  }

  useEffect(fetchRestaurant, [id])

  if (isNil(restaurant) || !user) {
    return null
  }

  const canAddReview = user.role === 'user'
  const leftReview = _.some(restaurant.reviews, function(o) {
    return o.user.id === user.id
  })

  const canEditRestaurant = user.role !== 'user'
  const reviews = orderBy('createdAt', 'desc', restaurant.reviews || [])

  return (
    <Container>
      <Typography className={classes.title} variant="h4" component="h1">
        {restaurant.name}
      </Typography>

      <Typography className={classes.title} variant="h5" component="h2">
        Summary
      </Typography>

      <Card className={classes.summary}>
        <CardMedia
          className={classes.summaryImage}
          image={restaurant.background_image_url}
          title={restaurant.name}
        />
        <CardContent className={classes.summaryDetail}>
          <Grid container spacing={0}>
            <Grid className={classes.summaryItem} item xs={12}>
              <Typography variant="h6" className={classes.subtitle}>
                Owner : {restaurant.owner.first_name} {restaurant.owner.last_name}
              </Typography>
            </Grid>
            <Grid className={classes.summaryItem} item xs={12}>
              <Typography variant="h6" className={classes.subtitle}>
                Average Rating :
              </Typography>
              <Box className={classes.summaryRating}>
                <Rating rating={restaurant.avg_rating} />
              </Box>
            </Grid>
            <Grid className={classes.summaryItem} item xs={12}>
              <Typography variant="h6" className={classes.subtitle}>
                Highest Rating :
              </Typography>
              <Box className={classes.summaryRating}>
                <Rating rating={restaurant.highest_rating} />
              </Box>
            </Grid>
            <Grid className={classes.summaryItem} item xs={12}>
              <Typography variant="h6" className={classes.subtitle}>
                Lowest Rating :
              </Typography>
              <Box className={classes.summaryRating}>
                <Rating rating={restaurant.lowest_rating} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography className={classes.title} variant="h5" component="h2">
        Last Reviews
      </Typography>
      <ReviewList reviews={reviews} />

      {canAddReview && (
        <Typography className={classes.title} variant="h5" component="h2">
          Add Review
        </Typography>
      )}

      {canAddReview && leftReview && (
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3">
              You already left a review.
            </Typography>
          </CardContent>
        </Card>
      )}

      {canAddReview && !leftReview && (
        <ReviewCreate restaurant={restaurant} onCreate={fetchRestaurant} />
      )}

      {canEditRestaurant && <Fab type="edit" to={`/restaurants/${id}/edit`} />}
    </Container>
  )
}

export default Info
