import React, {FC, useState} from 'react'
import Grid from '@material-ui/core/Grid'
import useForm from 'react-captain/useForm'
import {makeStyles} from '@material-ui/core/styles'
import some from 'lodash/fp/some'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import {red, yellow} from '@material-ui/core/colors'
import {useAxios} from '../../async/hooks'
import buildTextField from '../../common/components/TextField'
import buildDatePicker from '../../common/components/DatePicker'
import useAuthContext from '../../auth/context'
import {Restaurant} from '../../restaurant/model'
import {Review, emptyReview} from '../model'
import {emptyUser} from '../../user/model'
import buildMyRating from '../../common/components/MyRating'

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(4, 0),
  },
  card: {
    backgroundColor: yellow[50],
  },
  avatar: {
    backgroundColor: red[500],
  },
  button: {
    textTransform: 'none',
  },
  rating: {
    marginBottom: theme.spacing(4),
  },
}))

type Props = {
  restaurant: Restaurant
  onCreate: () => void
}

const CustomTextField = buildTextField<Review>()
const CustomDatePicker = buildDatePicker<Review>()
const CustomMyRating = buildMyRating<Review>()

const CreateReview: FC<Props> = props => {
  const {restaurant, onCreate: handleCreate} = props

  const axios = useAxios()
  const [authData] = useAuthContext()
  let user = authData ? authData.user : emptyUser

  const [review,] = useState<Review | null>(emptyReview)
  const {Form, useField} = useForm(review)

  const TextField = useField(CustomTextField)
  const DatePicker = useField(CustomDatePicker)
  const MyRating = useField(CustomMyRating)

  const classes = useStyles()

  const hasAlreadyReviewed = !user ? false : some({authorId: user.id}, restaurant.reviews)

  async function create(review: Review) {
    const request = axios.post('/reviews', {
      ...review,
      restaurant_id: restaurant.id,
      user: null,
      user_id: user.id,
    })
    request(handleCreate)
  }

  if (hasAlreadyReviewed) {
    return null
  }

  return (
    <Grid item xs={12}>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {user.first_name ? user.first_name.substring(0, 1).toUpperCase() : 'A'}
            </Avatar>
          }
          title={`${user.first_name} ${user.last_name}`}
        />
        <CardContent>
          <Form onSubmit={create}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MyRating name="rating" label="Rating" />
              </Grid>
              <Grid item xs={12}>
                <DatePicker name="date_visited" label="Date of the visit" />
              </Grid>
              <Grid item xs={12}>
                <TextField name="comment" label="Comment" multiline rows={5} />
              </Grid>
              <Grid item xs={12}>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                    >
                      Add Review
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default CreateReview
