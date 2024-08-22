// SignIn.tsx

import React, { useState } from "react";
import { Button, createTheme, MantineProvider, Title } from "@mantine/core";
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import HDImage from "../images/hd_signin.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerIpProps } from "../types"; // Adjust the path as needed

const theme = createTheme({
  headings: {
    fontWeight: "900",
    fontFamily: '"Roboto", sans-serif;',
  },
});

const SignIn: React.FC<ServerIpProps> = ({ serverIp }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post(serverIp + "/api/auth/signin", {
        email,
        password,
      });
      console.log("response: ", response);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token); // Save JWT token
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err: any) {
      console.log("error message: ", err.response?.data?.message);
      console.log("error: ", err);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden p-6 flex justify-around gap-5 items-center">
      <div className="hidden lg:inline h-full">
        <img src={HDImage} alt="HD Image" className="h-full object-contain" />
      </div>
      <div className="w-full sm:w-[460px] sm:min-w-[460px] border border-gray-300 p-8 rounded-xl shadow-lg">
        <MantineProvider theme={theme}>
          <Title order={3} size="h1" c="#3A244A" className="font-bold">
            Let us know <span className="text-[#D72638]">!</span>
          </Title>
        </MantineProvider>

        <div className="mt-2 mb-6 w-full">
          <TextField
            id="email"
            label="Email"
            variant="standard"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
            <InputLabel htmlFor="standard-adornment-password">
              Password
            </InputLabel>
            <Input
              id="standard-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
        <div className="h-8">
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <Button
          variant="filled"
          color="#3A244A"
          size="lg"
          radius="lg"
          fullWidth
          onClick={handleSignIn}
        >
          Sign In
        </Button>
        <Button
          mt={8}
          variant="outline"
          color="#3A244A"
          size="lg"
          radius="lg"
          fullWidth
          styles={{
            root: {
              borderWidth: "2px",
            },
          }}
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
