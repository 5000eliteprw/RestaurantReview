import React from 'react'
import {FieldComponent} from 'react-captain/useForm'
import {TextFieldProps} from '@material-ui/core/TextField'
import MaterialRating from '@material-ui/lab/Rating'

function MyRating<T>(): FieldComponent<T, number, TextFieldProps> {
  return props => (
    <MaterialRating
      value={props.value || 0}
      size="medium"
      precision={0.5}
      onChange={(event, newValue) => {
        props.onChange(newValue as number)
      }}
    />
  )
}

export default MyRating
