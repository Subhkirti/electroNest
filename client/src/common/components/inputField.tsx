import React, { useState } from "react";
import { MenuItem, TextField, IconButton, Tooltip } from "@mui/material";
import { uploadFile } from "../../store/customer/product/action";
import AppColors from "../appColors";
import { InfoOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

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
  infoText?: string;
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
  multiple,
  infoText,
}: InputFieldState) {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes("admin");
  const isFileType = type === "file";
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const idPopover = open ? "info-popover" : undefined;

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

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
      value={isFileType ? "" : value || ""}
      focused={isFileType ? true : undefined}
      onChange={readOnly ? undefined : handleChange}
      placeholder={placeholder}
      required={required}
      fullWidth
      variant="outlined"
      margin="normal"
      inputProps={
        isFileType
          ? { accept: acceptFile, multiple, maxLength: maxLength }
          : { maxLength: maxLength }
      }
      slotProps={{
        inputLabel: {
          shrink: value ? true : readOnly && value ? true : undefined,
        },
        input: {
          readOnly: readOnly,
          endAdornment: infoText && (
            <Tooltip open={open} title={infoText} arrow placement="top">
              <IconButton
                aria-describedby={idPopover}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                size="small"
              >
                <InfoOutlined
                  fontSize="small"
                  style={{ color: AppColors.blue, opacity: 0.6 }}
                />
              </IconButton>
            </Tooltip>
          ),
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: isAdminRoute ? AppColors.lightPurple : AppColors.gray,
          },
          "&:hover fieldset": {
            borderColor: isAdminRoute ? AppColors.lightPurple : AppColors.gray,
          },
          "&.Mui-focused fieldset": {
            borderColor: isAdminRoute ? AppColors.lightPurple : AppColors.gray,
          },
        },
        "& .MuiInputLabel-root": {
          opacity: 0.6,
          color: isAdminRoute ? AppColors.white : AppColors.black,
          "&.Mui-focused": {
            color: isAdminRoute
              ? isFileType
                ? AppColors.white
                : AppColors.lightPurple
              : AppColors.gray,
            opacity: isFileType ? 0.6 : 1,
          },
        },
        "& .MuiInputBase-input": {
          color: isAdminRoute ? AppColors.white : AppColors.black,
          cursor: isFileType ? "pointer" : "text",
        },
        "& .MuiInputBase-input::placeholder": {
          color: isAdminRoute ? AppColors.white : AppColors.black,
          opacity: isAdminRoute ? 0.5 : 1,
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
