import React from 'react'
import {FieldComponent} from 'react-captain/useForm'
import TextField, {TextFieldProps} from '@material-ui/core/TextField'

function CustomTextField<T>(): FieldComponent<T, string, TextFieldProps> {
  return props => (
    <TextField
      required
      fullWidth
      {...props}
      variant="standard"
      value={props.value || ''}
      onChange={({target}) => props.onChange(target.value)}
    />
  )
}

export default CustomTextField
