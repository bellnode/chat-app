import {
  Paper,
  Stack,
  Avatar,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import logo from "../../public/images/logo.png";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { emailValidator, usernameValidator } from "../utils/validators";
import { toast } from "react-hot-toast";
import userService from "../service/userService";
import { useNavigate } from "react-router-dom";
import storageService from "../service/storageService";
import { setUser } from "../redux/Slice/userSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [seePassword, setSeePassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const username = useInputValidation("", usernameValidator);
  const email = useInputValidation("", emailValidator);
  const bio = useInputValidation("");
  const password = useInputValidation("");
  const cpassword = useInputValidation("");
  const avatar = useFileHandler("single");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  //To ensure that user stay on home page when trying to access login page
  useEffect(() => {
    const token = storageService.getToken();
    if (token) {
      navigate("/home");
    } else {
      navigate("/");
    }
  }, []);

  const togglePassword = () => {
    if (seePassword) {
      setSeePassword(false);
    } else {
      setSeePassword(true);
    }
  };

  const openSignup = () => {
    if (isLogin) {
      setIsLogin(false);
      setSeePassword(false);
    } else {
      setIsLogin(true);
      setSeePassword(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    signIn();
  };

  const fetchUserProfile = async () => {
    try {
      const res = await userService.getMyProfileAPI();
      dispatch(setUser(res.user));
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const signIn = async () => {
    try {
      const signintoastId = toast.loading('Logging in....')
      const result = await userService.signInAPI(email.value, password.value);

      storageService.addToken(result.token);

      await fetchUserProfile();

      navigate("/home");

      toast.success("Logged In Successful",{id:signintoastId});
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error,{id:signintoastId});
    }
  };

  const handleSignUP = (e) => {
    e.preventDefault();
    createAccount();
  };

  const createAccount = async () => {
    if (username.value) {
      if (email.value) {
        if (bio.value) {
          if (password.value.length < 8) {
            toast.error("Password must be atleast 8 characters long");
            return;
          }
          if (password.value !== cpassword.value) {
            toast.error("Password does not match!");
            return;
          } else {
            try {
              // Create FormData object
              const formData = new FormData();
              formData.append("username", username.value);
              formData.append("bio", bio.value);
              formData.append("email", email.value);
              formData.append("password", password.value);
              formData.append("avatar", avatar.file); // Attach the avatar file

              // Send FormData using the API
              const result = await userService.signupAPI(formData);

              storageService.addToken(result.token);

              navigate("/home");

              toast.success("Signed Up Successfully");
            } catch (error) {
              toast.error(error.response.data.error);
            }
          }
        }
      }
    } else {
      toast.error("Please Enter valid Credentials");
      return;
    }
  };

  return (
    <>
      <div className=" flex justify-center items-center  bg-gradient-to-r from-purple-600 to-indigo-400 min-h-screen">
        <Paper elevation={7} className="my-14">
          <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6  space-y-2 md:space-y-2 sm:p-8">
              {isLogin ? (
                <>
                  <div className="flex justify-center w-full">
                    <img src={logo} className="w-20" alt="" />
                  </div>
                  <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
                    Sign in to <span className="text-indigo-500">Tangy</span>{" "}
                    Talks
                  </h1>
                  <form
                    className="space-y-4 md:space-y-6 pt-6"
                    action="#"
                    onSubmit={handleLogin}
                  >
                    <TextField
                      id="outlined"
                      name="email"
                      label="Email"
                      sx={{ width: "100%" }}
                      value={email.value}
                      onChange={email.changeHandler}
                    />
                    <TextField
                      id="outlined-password-input"
                      name="password"
                      label="Password"
                      type={seePassword ? "text" : "password"}
                      sx={{ width: "100%" }}
                      autoComplete="current-password"
                      value={password.value}
                      onChange={password.changeHandler}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="remember"
                            onChange={togglePassword}
                            aria-describedby="remember"
                            type="checkbox"
                            className="w-4 h-4 bg-white text-white border rounded focus:ring-3 focus:ring-indigo-300 "
                            required=""
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="remember" className="text-gray-500">
                            See password
                          </label>
                        </div>
                      </div>
                      <a
                        href="#"
                        className="text-sm font-medium text-indigo-600 hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-indigo-500 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                    >
                      Sign in
                    </button>
                    <p className="text-sm font-light text-gray-500">
                      Don’t have an account yet?{" "}
                      <a
                        href="#"
                        onClick={openSignup}
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        Sign up
                      </a>
                    </p>
                  </form>
                </>
              ) : (
                <>
                  <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    Create an <span className="text-indigo-500">Tangy</span>{" "}
                    Talks acoount
                  </h1>
                  <div className="flex flex-col w-fit relative m-auto items-center">
                    <Avatar
                      sx={{
                        width: "6rem",
                        margin: "5px",
                        height: "6rem",
                        objectFit: "cover",
                      }}
                      src={
                        avatar.preview
                          ? avatar.preview
                          : "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=mail@ashallendesign.co.uk"
                      }
                    ></Avatar>
                    <IconButton
                      sx={{
                        position: "absolute",
                        right: "0px",
                        bottom: "0px",
                        color: "white",
                        bgcolor: "rgba(0,0,0,0.5)",
                        padding: "4px",
                        " :hover": { bgcolor: "rgba(0,0,0,0.7)" },
                      }}
                      component="label"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                        />
                      </svg>
                      <input
                        onChange={avatar.changeHandler}
                        type="file"
                        name="userImage"
                        id="userImage"
                        style={{ clip: "rect(0 0 0 0)" }}
                        className="absolute border-[0px] overflow-hidden whitespace-nowrap w-1 h-1 p-[0px]"
                      />
                    </IconButton>
                  </div>
                  {avatar.error && (
                    <Typography
                      margin={"1rem"}
                      display={"block"}
                      textAlign={"center"}
                      color="error"
                      variant="caption"
                    >
                      {avatar.error}
                    </Typography>
                  )}
                  <form
                    className="space-y-4 md:space-y-4 pt-6"
                    action="#"
                    onSubmit={handleSignUP}
                  >
                    <TextField
                      id="outlined"
                      name="username"
                      label="Username"
                      sx={{ width: "100%" }}
                      value={username.value}
                      onChange={username.changeHandler}
                    />
                    {username.error && (
                      <Typography color="error" variant="caption">
                        {username.error}
                      </Typography>
                    )}
                    <TextField
                      id="outlined"
                      name="bio"
                      label="Bio"
                      sx={{ width: "100%" }}
                      value={bio.value}
                      onChange={bio.changeHandler}
                    />
                    <TextField
                      id="outlined-required"
                      name="email"
                      label="Email"
                      sx={{ width: "100%" }}
                      value={email.value}
                      onChange={email.changeHandler}
                    />
                    {email.error && (
                      <Typography color="error" variant="caption">
                        {email.error}
                      </Typography>
                    )}
                    <TextField
                      id="outlined-password-input"
                      name="password"
                      label="Password"
                      type={seePassword ? "text" : "password"}
                      sx={{ width: "100%" }}
                      autoComplete="current-password"
                      value={password.value}
                      onChange={password.changeHandler}
                    />
                    {password.error && (
                      <Typography color="error" variant="caption">
                        {password.error}
                      </Typography>
                    )}
                    <TextField
                      id="outlined-password-input"
                      name="cpassword"
                      label="Confirm Password"
                      type={seePassword ? "text" : "password"}
                      sx={{ width: "100%" }}
                      autoComplete="current-password"
                      value={cpassword.value}
                      onChange={cpassword.changeHandler}
                    />
                    {cpassword.error && (
                      <Typography color="error" variant="caption">
                        {cpassword.error}
                      </Typography>
                    )}
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="remember"
                          onChange={togglePassword}
                          aria-describedby="remember"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-indigo-300"
                          required=""
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="remember" className="text-gray-500">
                          See password
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full text-white bg-indigo-500 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Create an account
                    </button>
                    <p className="text-sm font-light text-gray-500">
                      Already have an account?{" "}
                      <a
                        href="#"
                        onClick={openSignup}
                        className="font-medium text-indigo-600 hover:underline "
                      >
                        Login here
                      </a>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </Paper>
      </div>
    </>
  );
};

export default Login;
