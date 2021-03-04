import React, {FC, Fragment} from 'react'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'

import {Review} from '../../review/model'

type Props = {
  review: Review
}

const useStyles = makeStyles(theme => ({
  comment: {
    fontStyle: 'italic',
  },
  reply: {
    fontStyle: 'italic',
    marginTop: theme.spacing(4),
  },
}))

const Comment: FC<Props> = props => {
  const {review} = props
  const classes = useStyles()

  return (
    <Fragment>
      <Typography className={classes.comment} color="textSecondary" component="blockquote">
        {review.comment.split('\n').map((line, key) => (
          <Fragment key={key}>
            {line}
            <br />
          </Fragment>
        ))}
      </Typography>
      {review.reply && (
        <Typography className={classes.reply} color="textSecondary" component="blockquote">
          Reply:
          <br />
          {review.reply.split('\n').map((line, key) => (
            <Fragment key={key}>
              {line}
              <br />
            </Fragment>
          ))}
        </Typography>
      )}
    </Fragment>
  )
}

export default Comment
