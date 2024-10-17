import { MenuItem, TextField } from "@mui/material";
import { uploadFile } from "../../store/customer/product/action";

type DropdownListItem = { label: string; value: any };

type DropdownKeys = { labelKey: string; valueKey: string };

interface InputFieldState {
  id: string;
  label: string;
  value: any;
  onChange: (elementValue: any, id: string) => void;
  dropdownOptions?: DropdownListItem[];
  dropdownKeys?: DropdownKeys;
  acceptFile?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  type?: "text" | "number" | "email" | "password" | "dropdown" | "file";
  multiple?: boolean; // Include this property
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
  multiple, // Destructure this property
}: InputFieldState) {

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "file" && e.target.files) {
      const files = Array.from(e.target.files);
      const fileUrls: string[] = [];

      for (const file of files) {
        const res = await uploadFile(file);
        if (res?.location) {
          fileUrls.push(res.location);
        }
      }

      onChange(fileUrls, id); // Send array of URLs
    } else if (type === "number" && maxLength) {
      const checkDigitRegex = /^[0-9]*$/;
      const elementValue = e.target.value;

      if (checkDigitRegex.test(elementValue)) {
        onChange(elementValue, id);
      }
    } else {
      const elementValue = e.target.value;
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
      inputProps={type === "file" ? { accept: acceptFile, multiple } : {}} // Use multiple here
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
