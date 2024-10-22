import { MenuItem, TextField } from "@mui/material";
import { uploadFile } from "../../store/customer/product/action";
import AppColors from "../appColors";

type DropdownListItem = { label: string; value: any };

type DropdownKeys = { labelKey: string; valueKey: string };

interface InputFieldState {
  id: string;
  label: string;
  value: any;
  onChange?: (elementValue: any, id: string) => void;
  dropdownOptions?: DropdownListItem[];
  dropdownKeys?: DropdownKeys;
  acceptFile?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  type?: "text" | "number" | "email" | "password" | "dropdown" | "file";
  multiple?: boolean;
  readOnly?: boolean;
}

export default function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  readOnly = false,
  placeholder,
  required = false,
  acceptFile,
  maxLength,
  dropdownOptions,
  dropdownKeys,
  multiple, // Destructure this property
}: InputFieldState) {
  const isFileType = type === "file";

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFileType && e.target.files) {
      const files = Array.from(e.target.files);
      const fileUrls: string[] = [];

      for (const file of files) {
        const res = await uploadFile(file);
        if (res?.Url) {
          fileUrls.push(res.Url);
        }
      }

      onChange && onChange(fileUrls, id);
    } else if (type === "number" && maxLength) {
      const checkDigitRegex = /^[0-9]*$/;
      const elementValue = e.target.value;

      if (checkDigitRegex.test(elementValue)) {
        onChange && onChange(elementValue, id);
      }
    } else {
      const elementValue = e.target.value;
      onChange && onChange(elementValue, id);
    }
  };

  return (
    <TextField
      select={type === "dropdown" && dropdownOptions ? true : false}
      label={label}
      type={maxLength ? "text" : type}
      value={isFileType ? undefined : value}
      focused={isFileType ? true : undefined}
      onChange={readOnly ? undefined : handleChange}
      placeholder={placeholder}
      required={required}
      fullWidth
      variant="outlined"
      margin="normal"
      inputProps={isFileType ? { accept: acceptFile, multiple } : {}}
      slotProps={{
        inputLabel: {
          shrink: value ? true : readOnly ? true : undefined,
        },
        input: {
          readOnly: readOnly,
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: AppColors.lightPurple,
          },
          "&:hover fieldset": {
            borderColor: AppColors.lightPurple,
          },
          "&.Mui-focused fieldset": {
            borderColor: AppColors.lightPurple,
          },
        },
        "& .MuiInputLabel-root": {
          opacity: 0.6,
          color: AppColors.white,
          "&.Mui-focused": {
            color: isFileType ? AppColors.white : AppColors.lightPurple,
            opacity: isFileType ? 0.6 : 1,
          },
        },
        "& .MuiInputBase-input": {
          color: AppColors.white,
          cursor: isFileType ? "pointer" : "text",
        },
        "& .MuiInputBase-input::placeholder": {
          color: AppColors.white,
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
