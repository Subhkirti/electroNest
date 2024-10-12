import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../common/appRoutes";
import { useDispatch, useSelector } from "react-redux";
import { passwordRegEx } from "../../../../common/constants";
import { toast } from "react-toastify";
import AppStrings from "../../../../common/appStrings";
import Loader from "../common/loader";
import { AppDispatch, RootState } from "../../../../store/storeTypes";
import { register } from "../../../../store/customer/auth/action";

function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  function handleOnSubmit(e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const password = data.get("password");

    // Validate password
    if (password && !passwordRegEx.test(password.toString())) {
      toast.error(AppStrings.passwordError);
      return;
    }

    const formData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: password,
    };
    dispatch(register(formData));
  }

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <Grid container spacing={2}>
          <Grid item lg={6} sm={12}>
            <TextField
              required
              id="firstName"
              name="firstName"
              label="First Name"
              fullWidth
              autoComplete="firstName"
            />
          </Grid>

          <Grid item lg={6} sm={12}>
            <TextField
              id="lastName"
              name="lastName"
              label="Last Name"
              fullWidth
              autoComplete="lastName"
            />
          </Grid>

          <Grid item lg={12} sm={12}>
            <TextField
              required
              id="email"
              name="email"
              label="Email Id"
              fullWidth
              type="email"
              autoComplete="email"
            />
          </Grid>

          <Grid item lg={12} sm={12}>
            <TextField
              required
              id="password"
              name="password"
              label="Password"
              fullWidth
              type={showPassword ? "text" : "password"}
              autoComplete="password"
              inputProps={{ minLength: 8 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff color="primary" />
                      ) : (
                        <Visibility color="primary" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item lg={12} sm={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="h-12"
            >
              {auth?.isLoading ? <Loader /> : AppStrings.register}
            </Button>
          </Grid>
        </Grid>
      </form>

      <p className="text-md text-center mt-6">
        {AppStrings.alreadyHaveAccount + " "}
        <span
          className="font-semibold text-primary hover:underline cursor-pointer"
          onClick={() => {
            navigate(AppRoutes.login);
          }}
        >
          {AppStrings.login}
        </span>
      </p>
    </div>
  );
}

export default RegisterForm;
