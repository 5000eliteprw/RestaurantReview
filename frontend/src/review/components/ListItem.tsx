import React, {FC} from 'react'
import {DateTime} from 'luxon'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import {yellow} from '@material-ui/core/colors'
import useAuthContext from '../../auth/context'
import Comment from '../../common/components/Comment'
import {Review} from '../model'
import {emptyUser} from '../../user/model'
import Rating from '../../common/components/Rating'

const useStyles = makeStyles(theme => ({
  summary: {
    backgroundColor: yellow[50],
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(1, 0),
  },
  summaryDetail: {
    flex: 1,
  },
  summaryImage: {
    width: 150,
    margin: 10,
  },
  comment: {
    fontStyle: 'italic',
  },
}))

type Props = RouteComponentProps & {
  review: Review
  disabled?: boolean
}

const ReviewItem: FC<Props> = props => {
  const {review, history, disabled} = props
  const [authData] = useAuthContext()
  let user = authData ? authData.user : emptyUser

  const classes = useStyles()
  const canReply =
    user && ((user.role === 'owner' && !disabled && review.reply === '') || user.role === 'admin')

  function handleClick() {
    if (canReply) {
      const action = user && user.role === 'admin' ? 'edit' : 'reply'
      history.push(`/reviews/${review.id}/${action}`)
    }
  }

  return (
    <Card className={classes.summary} elevation={1} square onClick={handleClick}>
      <CardMedia
        className={classes.summaryImage}
        image={review.restaurant.background_image_url}
        title="res"
      />
      <CardActionArea className={classes.summaryDetail}>
        <CardContent>
          <Typography variant="h6" component="h3">
            {review.user.first_name} {review.user.last_name}
            <Typography component="em" color="textSecondary">
              , visited {DateTime.fromISO(review.date_visited).toRelative()}
            </Typography>
          </Typography>
          <Comment review={review} />
          <Rating rating={review.rating} />
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default withRouter(ReviewItem)
