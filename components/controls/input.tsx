import React from 'react'
import { TextField } from '@material-ui/core'

function Input(props) {
  const { name, label, type, value, error=null, onChange, ...other} = props

  return (
    <TextField
      variant='outlined'
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && {error: true, helperText: error})}
    />
  )
}

export default Input