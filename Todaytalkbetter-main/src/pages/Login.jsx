import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {BACKEND_BASE_URL} from '../constant/URL'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/users/login`,
        {
          email,
          password,
          projectId: "664ece853e17537b70918cde",
        }
      );
      console.log("Login successful", response.data);
      // Store user profile and token in localStorage
      localStorage.setItem(
        "UserDetails",
        JSON.stringify(response.data.profile)
      );
      localStorage.setItem("Token", response.data.authToken);
      navigate("/");
    } catch (err) {
      console.error("Login error", err);
      setError("Login failed. Please check your email and password.");
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { credential } = response;
      const googleResponse = await axios.post(
        `${BACKEND_BASE_URL}/api/users/google-login`,
        {
          token: credential,
          projectId: "664ece853e17537b70918cde",
        }
      );
      console.log("Google login successful", googleResponse.data);
      // Store user profile and token in localStorage
      localStorage.setItem(
        "UserDetails",
        JSON.stringify(googleResponse.data.profile)
      );
      localStorage.setItem("Token", googleResponse.data.authToken);
      navigate("/");
    } catch (err) {
      console.error("Google login error", err);
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId="126939604567-fb0s64i0qssep1g10g9qma9e4sek8iqv.apps.googleusercontent.com">
      <div className="bg-black text-white min-h-screen flex items-center justify-center w-full absolute px-4 md:px-0">
        <div className="absolute top-20 ">
          <h1 className="text-2xl md:text-3xl font-semibold text-center ">
            <span className="text-white">Talk</span>
            <span className="text-blue-500">Better</span>
          </h1>
        </div>
        <div className="w-full max-w-md md:max-w-lg p-4 md:p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-semibold mt-2">
              Sign into your account
            </h2>
            <p className="text-zinc-400 font-medium">
              Manage your autonomous voice assistants in one dashboard
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-400"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 bg-[#1F1B29] rounded-md text-white"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-400"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full py-2 px-3 p-2 bg-[#1F1B29] rounded-md text-white"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-6 focus:outline-none"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="white"
                    viewBox="0 0 256 256"
                  >
                    <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="white"
                    viewBox="0 0 256 256"
                  >
                    <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path>
                  </svg>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full p-3 bg-[#5D5FEF] rounded-md">
              Sign in
            </button>
          </form>

          <div className="flex items-center justify-center bg-zinc-800 p-2 py-3">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                console.error("Login Failed");
                setError("Google login failed. Please try again.");
              }}
            />
          </div>

          <div className="text-center text-sm text-zinc-400">
            <p>
              Don't have an account?{" "}
              <Link to={"/register"} className="text-[#6062F8] text-lg">
                Sign up
              </Link>
            </p>
          </div>

          <p className="text-xs text-center text-zinc-600">
            By using TalkBetter you agree to our{" "}
            <a href="#" className="text-[#6062F8]">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#6062F8]">
              Security
            </a>{" "}
            policies and practices.
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
