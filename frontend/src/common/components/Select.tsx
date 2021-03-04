import React, {ChangeEvent, useRef} from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Select, {SelectProps} from '@material-ui/core/Select'
import {FieldComponent} from 'react-captain/useForm'
import getOr from 'lodash/fp/getOr'
import isNull from 'lodash/fp/isNull'
import isNumber from 'lodash/fp/isNumber'

function buildCustomSelect<T>() {
  const CustomSelect: FieldComponent<T, string | number, SelectProps> = props => {
    const labelRef = useRef<HTMLLabelElement>()
    const labelWidth = getOr(110, 'offsetWidth', labelRef.current)

    function handleChange(event: ChangeEvent<SelectProps>) {
      const {value} = event.target

      if (isNull(props.value)) return props.onChange(null)
      if (isNumber(props.value)) return props.onChange(Number(value))
      return props.onChange(String(value))
    }

    return (
      <FormControl variant="outlined" fullWidth>
        <InputLabel innerRef={labelRef}>{props.label}</InputLabel>
        <Select
          {...props}
          value={String(props.value)}
          onChange={handleChange}
          input={<OutlinedInput labelWidth={labelWidth} />}
        >
          {props.children}
        </Select>
      </FormControl>
    )
  }

  return CustomSelect
}

export default buildCustomSelect
