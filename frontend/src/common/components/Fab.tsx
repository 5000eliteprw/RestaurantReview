import React, {FC} from 'react'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import MUIFab from '@material-ui/core/Fab'
import IconCreate from '@material-ui/icons/Add'
import IconEdit from '@material-ui/icons/Edit'
import IconDelete from '@material-ui/icons/Delete'
import {makeStyles} from '@material-ui/core/styles'

type Props = RouteComponentProps & {
  type: 'create' | 'edit' | 'delete'
  to?: string
  onClick?: () => void
}

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
}))

const Fab: FC<Props> = props => {
  const classes = useStyles()

  function handleClick() {
    if (props.onClick) {
      props.onClick()
    } else if (props.to) {
      props.history.push(props.to)
    }
  }

  return (
    <MUIFab className={classes.fab} color="secondary" onClick={handleClick}>
      {props.type === 'create' && <IconCreate />}
      {props.type === 'edit' && <IconEdit />}
      {props.type === 'delete' && <IconDelete />}
    </MUIFab>
  )
}

export default withRouter(Fab)
