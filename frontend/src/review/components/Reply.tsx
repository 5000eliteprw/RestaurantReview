import React, {FC, useEffect, useState} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import useForm from 'react-captain/useForm'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import isNil from 'lodash/fp/isNil'

import {useAxios} from '../../async/hooks'
import Submit from '../../common/components/Submit'
import buildTextField from '../../common/components/TextField'
import useAuthContext from '../../auth/context'
import {Review, emptyReview} from '../model'
import ListItem from './ListItem'
import {emptyUser} from '../../user/model'

type Props = RouteComponentProps<{id: string}>

const CustomTextField = buildTextField<Review>()

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(4, 0),
  },
  form: {
    marginTop: theme.spacing(2),
  },
}))

const ReviewReply: FC<Props> = props => {
  const id = Number(props.match.params.id)

  const axios = useAxios()
  const [review, setReview] = useState<Review | null>(null)

  const [authData] = useAuthContext()
  let user = authData ? authData.user : emptyUser

  const {Form, useField} = useForm(emptyReview)
  const TextField = useField(CustomTextField)
  const classes = useStyles()

  function fetchReview() {
    const request = axios.get(`/reviews/${id}`)
    request(res => setReview(res.data))
  }

  function reply(review: Review) {
    setReview(review)

    const request = axios.put(`/reviews/${id}/reply`, {reply: review.reply})
    return request(() => {
      props.history.push('/reviews')
      return 'Review successfully replied!'
    })
  }

  useEffect(fetchReview, [])

  if (isNil(review) || !user) {
    return null
  }

  return (
    <Container>
      <Typography className={classes.title} variant="h4" component="h2">
        Reply to review
      </Typography>

      <ListItem review={review} disabled />

      <Form className={classes.form} onSubmit={reply}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField name="reply" label="Reply" multiline rows={5} />
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
    </Container>
  )
}

export default withRouter(ReviewReply)
