import React from 'react'
import DatePicker from 'react-datepicker'
import {FieldComponent} from 'react-captain/useForm'
import {DateTime} from 'luxon'
import TextField, {TextFieldProps} from '@material-ui/core/TextField'

function CustomDatePicker<T>(): FieldComponent<T, string, TextFieldProps> {
  return props => (
    <DatePicker
      customInput={<TextField variant="outlined" fullWidth label={props.label} />}
      selected={props.value ? DateTime.fromISO(props.value).toJSDate() : null}
      onChange={date => props.onChange(date ? DateTime.fromJSDate(date).toISO() : null)}
      showTimeSelect
      timeIntervals={15}
      dateFormat="MMMM d, yyyy h:mm aa"
      shouldCloseOnSelect
      showYearDropdown
      required
    />
  )
}

export default CustomDatePicker
