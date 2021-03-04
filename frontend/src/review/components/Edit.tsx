import React, {FC, useEffect, useState} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import useForm from 'react-captain/useForm'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'

import {useAxios} from '../../async/hooks'
import Fab from '../../common/components/Fab'
import Submit from '../../common/components/Submit'
import buildTextField from '../../common/components/TextField'
import buildDatePicker from '../../common/components/DatePicker'
import useAuthContext from '../../auth/context'
import {Review, emptyReview} from '../model'
import {emptyUser} from '../../user/model'
import buildMyRating from '../../common/components/MyRating'

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(4, 0),
  },
  form: {
    marginTop: theme.spacing(2),
  },
  rating: {
    marginBottom: theme.spacing(4),
  },
}))

type Props = RouteComponentProps<{id: string}>

const CustomTextField = buildTextField<Review>()
const CustomDatePicker = buildDatePicker<Review>()
const CustomMyRating = buildMyRating<Review>()

const ReviewEdit: FC<Props> = props => {
  const id = Number(props.match.params.id)

  const axios = useAxios()
  const [review, setReview] = useState<Review | null>(null)
  const [authData] = useAuthContext()
  let user = authData ? authData.user : emptyUser

  const {Form, useField} = useForm(review)
  const TextField = useField(CustomTextField)
  const DatePicker = useField(CustomDatePicker)
  const MyRating = useField(CustomMyRating)

  const classes = useStyles()

  function fetchReview() {
    if (id) {
      const request = axios.get(`/reviews/${id}`)
      request(res => {
        let reviewData = res.data as Review
        setReview(reviewData)
      })
    } else {
      setReview(emptyReview)
    }
  }

  function update(review: Review) {
    const request = axios.put(`/reviews/${id}`, review)
    return request(() => {
      props.history.push('/restaurants')
      return 'Review successfully updated!'
    })
  }

  function remove() {
    const request = axios.delete(`/reviews/${id}`)
    return request(() => {
      props.history.push('/restaurants')
      return 'Review successfully deleted!'
    })
  }

  useEffect(fetchReview, [])

  if (!review || !user) {
    return null
  }

  const canDeleteReview = user.role === 'admin'

  return (
    <Container>
      <Typography className={classes.title} variant="h4" component="h2">
        Edit a review
      </Typography>
      <Form className={classes.form} onSubmit={update}>
        <Grid container spacing={2}>
          <Grid item xs={12} />
          <MyRating name="rating" label="Rating" />
          <Grid item xs={12}>
            <DatePicker name="date_visited" label="Date of the visit" />
          </Grid>
          <Grid item xs={12}>
            <TextField name="comment" label="Comment" multiline rows={5} />
          </Grid>
          <Grid item xs={12}>
            <TextField name="reply" label="Reply" multiline rows={5} required={false} />
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
      {canDeleteReview && <Fab type="delete" onClick={remove} />}
    </Container>
  )
}

export default withRouter(ReviewEdit)
