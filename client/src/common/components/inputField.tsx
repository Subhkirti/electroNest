import { MenuItem, TextField } from "@mui/material";
import { uploadFile } from "../../store/customer/product/action";

type DropdownListItem = { label: string; value: any };

type DropdownKeys = { labelKey: string; valueKey: string };

interface InputFieldState {
  id: string;
  label: string;
  value: any;
  onChange: (elementValue: string, id: string) => void;
  dropdownOptions?: DropdownListItem[];
  dropdownKeys?: DropdownKeys;
  acceptFile?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  type?: "text" | "number" | "email" | "password" | "dropdown" | "file";
}

export default function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  acceptFile,
  maxLength,
  dropdownOptions,
  dropdownKeys,
}: InputFieldState) {
  
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const elementValue = e.target.value;

    if (type === "file" && e.target.files) {
      const file = e.target.files[0];
      if (file) {
        const res = await uploadFile(file);
        onChange(res?.location, id);
      }
    } else if (type === "number" && maxLength) {
      const checkDigitRegex = /^[0-9]*$/;
      if (checkDigitRegex.test(elementValue)) {
        onChange(elementValue, id);
      }
    } else {
      onChange(elementValue, id);
    }
  };

  return (
    <TextField
      select={type === "dropdown" && dropdownOptions ? true : false}
      label={label}
      type={maxLength ? "text" : type}
      value={type === "file" ? undefined : value}
      focused={type === "file" ? true : undefined}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      fullWidth
      variant="outlined"
      margin="normal"
      inputProps={type === "file" ? { accept: acceptFile } : {}}
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
            color: type === "file" ? "#fff" : "#9f5eff",
            opacity: type === "file" ? 0.6 : 1,
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
      {type === "dropdown" &&
        dropdownOptions &&
        dropdownOptions.map((option) => {
          const labelKey = dropdownKeys?.labelKey as keyof DropdownListItem;
          const valueKey = dropdownKeys?.valueKey as keyof DropdownListItem;
          const itemLabel = labelKey ? option[labelKey] : option.label;
          const itemValue = valueKey ? option[valueKey] : option.value;
          return (
            <MenuItem key={itemValue} value={itemValue}>
              {itemLabel}
            </MenuItem>
          );
        })}
    </TextField>
  );
}
