import { MenuItem, TextField } from "@mui/material";
import {  useState } from "react";

type DropdownListItem = { label: string; value: any };

type DropdownKeys = { labelKey: string; valueKey: string };
interface InputFieldState {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string;
  onChange: (elementValue: string, id: string) => void;
  dropdownOptions?: DropdownListItem[];
  dropdownKeys?: DropdownKeys;
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
  dropdownOptions,
  dropdownKeys,
}: InputFieldState) {
  const [value, setValue] = useState<string>();

  return (
    <TextField
      select={type === "dropdown" && dropdownOptions ? true : false}
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
          opacity: 0.6,
          color: "#fff",
          "&.Mui-focused": {
            color: "#9f5eff",
            opacity: 1,
          },
        },
        "& .MuiInputBase-input": {
          color: "#fff",
        },
        "& .MuiInputBase-input::placeholder": {
          color: "#fff",
          opacity: 0.5,
        },
      }}
    >
      {dropdownOptions &&
        dropdownOptions.length > 0 &&
        dropdownOptions.map((option) => {
          const labelKey = dropdownKeys?.labelKey as keyof DropdownListItem;
          const valueKey = dropdownKeys?.valueKey as keyof DropdownListItem;
          const itemLabel = labelKey ? option[labelKey] : option?.label;
          const itemValue = valueKey ? option[valueKey] : option?.value;
          return (
            <MenuItem key={itemValue} value={itemValue}>
              {itemLabel}
            </MenuItem>
          );
        })}
    </TextField>
  );
}
