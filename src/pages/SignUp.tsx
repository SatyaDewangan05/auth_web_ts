// SignUp.tsx

import React, { useEffect, useState } from "react";
import HDImage from "../images/hd_signup.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Button,
  createTheme,
  MantineProvider,
  Modal,
  PinInput,
  Title,
} from "@mantine/core";
import {
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  SelectChangeEvent,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDisclosure } from "@mantine/hooks";
import { ServerIpProps } from "../types"; // Adjust the path as needed

const theme = createTheme({
  headings: {
    fontWeight: "900",
    fontFamily: '"Roboto", sans-serif;',
  },
});

interface FormData {
  firstName: string;
  lastName: string;
  password: string;
  retypePassword: string;
  contact: string;
  email: string;
}

interface Errors {
  firstName: boolean;
  lastName: boolean;
  password: boolean;
  retypePassword: boolean;
  contact: boolean;
  email: boolean;
}

const SignUp: React.FC<ServerIpProps> = ({ serverIp }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    password: "",
    retypePassword: "",
    contact: "",
    email: "",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setFormData({ ...formData, contact: event.target.value });
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    firstName: false,
    lastName: false,
    password: false,
    retypePassword: false,
    contact: false,
    email: false,
  });

  const handleSubmit = async () => {
    const { firstName, lastName, password, retypePassword, email, contact } =
      formData;

    const newErrors: Errors = {
      firstName: firstName === "",
      lastName: lastName === "",
      password: password === "",
      retypePassword: retypePassword === "",
      contact: contact === "",
      email: email === "",
    };

    setErrors(newErrors);

    // Check if there are any errors before proceeding
    if (Object.values(newErrors).some((error) => error)) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== retypePassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post(serverIp + "/api/auth/signup", {
        firstName,
        lastName,
        password,
        email,
        contact,
      });

      //   alert(response.data.message);
      setLoading(false);
      // localStorage.setItem("token", response.data.token); // Save JWT token
      open();
    } catch (error: any) {
      // console.log("error: ", error);
      alert(
        "Signup failed: " + (error.response?.data?.message || error.message)
      );
      if (error.response?.status === 409) navigate("/");
      setLoading(false);
    }
  };

  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  useEffect(() => {
    console.log("otp: ", otp);
  }, [otp]);

  const verifyOTP = async () => {
    setOtpLoading(true);
    try {
      const { email } = formData;
      const response = await axios.post(serverIp + "/api/auth/verify-otp", {
        email,
        otp,
      });
      console.log("response: ", response.data);
      setOtpLoading(false);
      localStorage.setItem("token", response.data.token); // Save JWT token
      navigate("/dashboard");
    } catch (error: any) {
      alert(
        "Signup failed: " + (error.response?.data?.message || error.message)
      );
      setOtpLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden p-6 flex justify-around gap-5 items-center">
      <div className="hidden lg:inline h-full">
        <img src={HDImage} alt="HD Image" className="h-full object-contain" />
      </div>
      <div className="w-full sm:w-[460px] sm:min-w-[460px] border border-gray-300 p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <MantineProvider theme={theme}>
            <Title order={3} size="h1" c="#3A244A" className="font-bold">
              Let us know <span className="text-[#D72638]">!</span>
            </Title>
          </MantineProvider>
          <Link href="/">
            <p className="underline hover:opacity-70 text-[#3A244A] font-['Roboto'] font-extrabold">
              Sign <span className="text-[#D72638]">In</span>
            </p>
          </Link>
        </div>

        <div className="mt-2 w-full">
          <TextField
            id="firstName"
            label="First Name"
            variant="standard"
            fullWidth
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />

          <TextField
            id="lastName"
            label="Last Name"
            variant="standard"
            sx={{ mt: 2 }}
            fullWidth
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />

          <FormControl
            variant="standard"
            fullWidth
            sx={{ mt: 2 }}
            error={errors.password}
          >
            <InputLabel htmlFor="set-password">Set Password</InputLabel>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
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

          <FormControl
            variant="standard"
            fullWidth
            sx={{ mt: 2 }}
            error={errors.retypePassword}
          >
            <InputLabel htmlFor="retry-password">Retype Password</InputLabel>
            <Input
              id="retypePassword"
              type={showPassword ? "text" : "password"}
              value={formData.retypePassword}
              onChange={handleChange}
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

          <FormControl variant="standard" sx={{ mt: 2 }} fullWidth>
            <InputLabel id="contact-mode-label">Contact Mode</InputLabel>
            <Select
              labelId="contact-mode-label"
              id="contact-mode"
              value={formData.contact}
              onChange={handleSelectChange}
              label="Contact Mode"
              error={errors.contact}
            >
              <MenuItem value="email">Email</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="email"
            label="Email"
            variant="standard"
            placeholder="Enter Email"
            sx={{ mt: 2 }}
            fullWidth
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>
        <Button
          mt={32}
          color="#3A244A"
          size="lg"
          radius="lg"
          fullWidth
          styles={{
            root: {
              borderWidth: "2px",
            },
          }}
          loading={loading}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
        <Modal opened={opened} onClose={close} title="Enter OTP" centered>
          <div className="w-full flex flex-col gap-5 items-center justify-center mb-2">
            <p>OPT send to Your Email</p>
            <PinInput
              type={/^[0-9]*$/}
              inputType="tel"
              inputMode="numeric"
              length={6}
              onChange={setOtp}
            />
            <Button onClick={verifyOTP} loading={otpLoading}>
              Send
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SignUp;
