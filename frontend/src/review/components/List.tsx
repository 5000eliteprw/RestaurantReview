import React, {FC} from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import ReviewItem from '../../review/components/ListItem'
import {Review} from '../../review/model'

type Props = {
  reviews: Review[]
}

const ReviewList: FC<Props> = props => {
  const {reviews} = props

  return (
    <Grid item xs={12}>
      {reviews.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" component="h3">
              There is no reviews.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        reviews.map(review => <ReviewItem key={review.id} review={review} />)
      )}
    </Grid>
  )
}

export default ReviewList
