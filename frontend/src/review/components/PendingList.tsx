import React, { FC, useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import useAuthContext from '../../auth/context'
import { useAxios } from '../../async/hooks'
import { emptyUser } from '../../user/model'
import { Review } from '../model'
import { useSnackbar } from 'notistack'
import ReviewList from './List'

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(4),
  },
  title: {
    margin: theme.spacing(4, 0),
  },
}))

const PendingReviewList: FC = () => {
  const axios = useAxios()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [authData] = useAuthContext()
  let user = authData ? authData.user : emptyUser
  const [ownerId, setOwnerId] = useState<number | null>(-1)

  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    setOwnerId(user.id)
  }, [user])

  function fetchReviews(owner_id: number | null, is_pending: Boolean | null): void {
    const request = axios.get('/reviews', { owner_id, is_pending })
    request(res => {
      if (res.data instanceof Array) {
        let reviews = res.data as Review[]
        console.log('Reviews :', reviews)

        setReviews(reviews)
      } else {
        enqueueSnackbar('Invalid restaurants response', {
          variant: 'warning',
        })
      }
    })
  }

  useEffect(() => {
    const is_pending = true
    if (ownerId == null || ownerId > 0) {
      fetchReviews(ownerId, is_pending)
    }
  }, [ownerId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Typography className={classes.title} variant="h3" component="h1">
        Pending reviews
      </Typography>

      <ReviewList reviews={reviews} />
    </Container>
  )
}

export default PendingReviewList
