import React, {FC, useEffect, useState} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import Container from '@material-ui/core/Container'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import isNull from 'lodash/fp/isNull'

import {useAxios} from '../../async/hooks'
import {User} from '../model'
import {useSnackbar} from 'notistack'

const useStyles = makeStyles(theme => ({
  title: {
    margin: theme.spacing(4, 0),
  },
  row: {
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.grey[200],
    },
  },
}))

const UserList: FC<RouteComponentProps> = props => {
  const axios = useAxios()
  const [users, setUsers] = useState<User[] | null>(null)
  const classes = useStyles()
  const {enqueueSnackbar} = useSnackbar()

  function fetchUsers() {
    const request = axios.get('/users')
    request(res => {
      if (res.data instanceof Array) {
        let users = res.data as User[]

        setUsers(users)
      } else {
        enqueueSnackbar('Invalid users response', {
          variant: 'warning',
        })
      }
    })
  }

  function show(id: number) {
    return () => props.history.push(`/users/${id}`)
  }

  useEffect(fetchUsers, [])

  if (isNull(users)) {
    return null
  }

  return (
    <Container>
      <Typography className={classes.title} variant="h3" component="h1">
        Users
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id} className={classes.row} onClick={show(user.id)}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}

export default UserList
