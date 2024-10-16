import { MenuItem, TextField } from "@mui/material";
import { useState } from "react";

interface MenuOptions {
  value: string;
  label: string;
}

interface InputFieldState {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string;
  onChange: (elementValue: string, id: string) => void;
  menuOptions?: MenuOptions[];
  type?: "text" | "number" | "email" | "password" | "dropdown";
}

export default function InputField({
  id,
  label,
  type = "text",
  defaultValue,
  onChange,
  placeholder,
  required = false,
  maxLength,
  menuOptions,
}: InputFieldState) {
  const [value, setValue] = useState<string>();

  return (
    <TextField
      select={type === "dropdown" && menuOptions ? true : false}
      label={label}
      type={maxLength ? "text" : type}
      value={defaultValue || value}
      onChange={(e) => {
        const elementValue = e.target.value;
        if (type === "number" && maxLength) {
          const checkDigitRegex = /^[0-9]*$/;
          if (checkDigitRegex.test(elementValue)) {
            setValue(elementValue);
            onChange(elementValue, id);
          }
        } else {
          setValue(elementValue);
          onChange(elementValue, id);
        }
      }}
      inputProps={{
        maxLength: maxLength,
        style: { color: "#fff" },
      }}
      placeholder={placeholder}
      required={required}
      fullWidth
      variant="outlined"
      margin="normal"
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#9f5eff",
          },
          "&:hover fieldset": {
            borderColor: "#9f5eff",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#9f5eff",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#fff",
          "&.Mui-focused": {
            color: "#9f5eff",
          },
        },
        "& .MuiInputBase-input::placeholder": {
          color: "#fff",
          opacity: 0.5,
        },
      }}
    >
      {menuOptions &&
        menuOptions.length > 0 &&
        menuOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
}
