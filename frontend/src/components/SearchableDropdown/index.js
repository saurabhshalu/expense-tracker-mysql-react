import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const SearchableDropdown = ({
  items = [],
  freeSolo = false,
  name,
  label,
  onChange,
  value,
  fullWidth = true,
  required = false,
}) => {
  return (
    <Autocomplete
      size="small"
      fullWidth={fullWidth}
      freeSolo={freeSolo}
      value={value}
      onChange={(_, newValue) => {
        const e = {
          target: {
            name: name,
            value: newValue,
          },
        };
        onChange(e);
      }}
      getOptionLabel={(option) => {
        return option.name;
      }}
      options={items}
      renderInput={(params) => (
        <TextField {...params} required={required} label={label} />
      )}
      isOptionEqualToValue={(option, value) => option.name === value.name}
    />
  );
};

export default SearchableDropdown;
