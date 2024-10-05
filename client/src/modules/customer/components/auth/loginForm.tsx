import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../common/appRoutes";
import { login } from "../../store/auth/action";
import { useDispatch } from "react-redux";
import { passwordRegEx } from "../../../../common/constants";

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  function handleOnSubmit(e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const password = data.get("password");

    // Validate password
    if (password && !passwordRegEx.test(password.toString())) {
      setError(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    const formData = {
      email: data.get("email"),
      password: password,
    };
    dispatch(login(formData));
    // Reset error if the password is valid
    setError("");
  }

  const handleCloseSnackbar = () => {
    setError("");
  };

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <Grid container spacing={2}>
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
              Login
            </Button>
          </Grid>
        </Grid>
      </form>

      <p className="text-md text-center mt-6">
        if you don't have an account?{" "}
        <span
          className="font-semibold text-primary hover:underline"
          onClick={() => {
            navigate(AppRoutes.register);
          }}
        >
          Register
        </span>
      </p>

      {/* Snackbar for error messages */}
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default LoginForm;
