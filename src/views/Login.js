import React, {useState, Fragment, useContext, useEffect} from "react";
import {
  Card,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import backgroundImage from "@src/assets/images/background_dot.png";
//import backgroundImage2 from "@src/assets/images/blc-logo-5.png";
import {ThemeColors} from "@src/utility/context/ThemeColors";
import {useDispatch, useSelector} from "react-redux";
import {useSnackbar} from "notistack";
import {useHistory} from "react-router-dom";
import {DefaultRoute} from "../router/routes";
import {handleLogin} from "../redux/actions/auth";

const Login = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const authState = useSelector((state) => state.auth);
  const { colors } = useContext(ThemeColors);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
      setEmailTouched(true);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
      setPasswordTouched(true);
    }
    setSubmitError(null);
  };

  const handleBlur = (event) => {
    if (event.target.name === "email") {
      setEmail(event.target.value);
      setEmailTouched(false);
    } else if (event.target.name === "password") {
      setPassword(event.target.value);
      setPasswordTouched(false);
    }
    setSubmitError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === "" || password === "") {
      setSubmitError("Tüm alanlar zorunludur.");
      return;
    }

    setLoading(true);
    dispatch(handleLogin(email, password)).then((data) => {
      setLoading(false);
      enqueueSnackbar(
        "Login is successful " + data.user.name + "...",
        {
          variant: "success",
          preventDuplicate: true,
        },
      );
    }).catch((error) => {
      setLoading(false);
      enqueueSnackbar(
        error.message,
        {
          variant: "error",
          preventDuplicate: true,
        }
      );
      setSubmitError(error.message);
    });
  };

  useEffect(() => {
    if (authState.isLoggedIn === true) {
      history.push(DefaultRoute);
    }
  }, [authState.isLoggedIn]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      sx={{ minHeight: "100vh" }}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "repeat",
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "calc(100vh - 68px)" }}
      >
        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
          <Card
            sx={{
              maxWidth: { xs: 400, lg: 475 },
              margin: { xs: 2.5, md: 3 },
              "& > *": {
                flexGrow: 1,
                flexBasis: "50%",
              },
            }}
            content={false}
          >
            <Box sx={{ p: { xs: 2, sm: 3, xl: 5 } }}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={12}>
                  <Grid
                    container
                    direction="column-reverse"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                      >
                        <Typography
                          color={"rgb(103, 58, 183)"}
                          gutterBottom
                          variant="h3"
                          style={{
                            fontSize: "1.25rem",
                            color: colors.primary.dark,
                            fontWeight: 600,
                          }}
                        >
                          Welcome Back
                        </Typography>
                        <Typography
                          variant="caption"
                          fontSize="15px"
                          textAlign="center"
                          style={{
                            color: "rgba(158, 158, 158, 0.7)",
                            fontWeight: 400,
                            lineHeight: 1.66,
                            maxWidth: 300,
                          }}
                        >
                          Enter your authorized user informations to continue.
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    id="login-form"
                  >
                    <FormControl
                      fullWidth
                      error={Boolean(emailTouched, submitError)}
                      sx={{ ...colors.primary.light }}
                    >
                      <InputLabel htmlFor="outlined-adornment-email-login">
                        Email 
                      </InputLabel>
                      <OutlinedInput
                        id="login-email-input"
                        type="email"
                        value={email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Email"
                        inputProps={{}}
                      />
                    </FormControl>

                    <FormControl
                      fullWidth
                      error={Boolean(passwordTouched, submitError)}
                      sx={{ ...colors.primary.light }}
                      style={{
                        marginTop: "1rem",
                      }}
                    >
                      <InputLabel htmlFor="outlined-adornment-password-login">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password-login"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(true)}
                              onMouseDown={() => setShowPassword(false)}
                              edge="end"
                              size="large"
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Şifre"
                        inputProps={{}}
                      />
                    </FormControl>
                    {/* <Typography
                      variant="subtitle1"
                      color="secondary"
                      sx={{ textDecoration: "none", cursor: "pointer" }}
                      style={{
                        fontSize: "0.875rem",
                        color: "rgb(103, 58, 183)",
                        cursor: "pointer",
                        textAlign: 'right',
                        paddingTop: 20,
                      }}
                    >
                      Şifrenizi mi unuttunuz?
                    </Typography> */}
                    {submitError && (
                      <Box sx={{ mt: 3 }}>
                        <FormHelperText error>{submitError}</FormHelperText>
                      </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Button
                        disableElevation
                        disabled={loading}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="secondary"
                        id="login-form-submit-button"
                      >
                        Login
                      </Button>
                    </Box>
                  </form>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Login;
