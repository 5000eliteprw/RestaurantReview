import React, {FC, Fragment} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import MaterialRating from '@material-ui/lab/Rating'

type Props = {
  rating?: number
}

const useStyles = makeStyles(theme => ({
  rating: {
    margin: theme.spacing(1),
  },
}))

const Rating: FC<Props> = props => {
  const {rating} = props
  const classes = useStyles()

  return (
    <Fragment>
      <MaterialRating
        value={rating}
        size="medium"
        className={classes.rating}
        precision={0.5}
        disabled
      />
    </Fragment>
  )
}

export default Rating
