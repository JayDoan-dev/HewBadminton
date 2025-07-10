"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { LoginState } from "@wix/sdk";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Image from "next/image";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {
  const wixClient = useWixClient();
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [mode, setMode] = useState(MODE.LOGIN);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const checkLogin = async () => {
      const isLoggedIn = await wixClient.auth.loggedIn();
      if (isLoggedIn) {
        router.push("/");
      } else {
        setCheckingAuth(false);
      }
    };
    checkLogin();
  }, [router, wixClient]);

  const formTitle =
    mode === MODE.LOGIN
      ? "Log in"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset Your Password"
      : "Verify Your Email";

  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "Verify";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      let response;

      switch (mode) {
        case MODE.LOGIN:
          response = await wixClient.auth.login({ email, password });
          break;
        case MODE.REGISTER:
          response = await wixClient.auth.register({
            email,
            password,
            profile: { nickname: username },
          });
          break;
        case MODE.RESET_PASSWORD:
          response = await wixClient.auth.sendPasswordResetEmail(
            email,
            window.location.href
          );
          setMessage("Password reset email sent. Please check your e-mail.");
          break;
        case MODE.EMAIL_VERIFICATION:
          response = await wixClient.auth.processVerification({
            verificationCode: emailCode,
          });
          break;
      }

      switch (response?.loginState) {
        case LoginState.SUCCESS:
          setMessage("Successful! You are being redirected.");
          const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
            response.data.sessionToken!
          );
          Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
            expires: 2,
          });
          wixClient.auth.setTokens(tokens);
          router.push("/");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          break;

        case LoginState.FAILURE:
          if (
            response.errorCode === "invalidEmail" ||
            response.errorCode === "invalidPassword"
          ) {
            setError("Invalid email or password!");
          } else if (response.errorCode === "emailAlreadyExists") {
            setError("Email already exists!");
          } else if (response.errorCode === "resetPassword") {
            setError("You need to reset your password!");
          } else {
            setError("Something went wrong!");
          }
          break;

        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setMode(MODE.EMAIL_VERIFICATION);
          break;

        case LoginState.OWNER_APPROVAL_REQUIRED:
          setMessage("Your account is pending approval");
          break;
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) return null; // or a spinner

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/Logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="w-40 h-40 object-contain"
            priority
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {formTitle}
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {mode === MODE.REGISTER && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-hew transition duration-300 hover:border-hew"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          {mode !== MODE.EMAIL_VERIFICATION ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-hew transition duration-300 hover:border-hew"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                name="emailCode"
                placeholder="Enter code"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-hew transition duration-300 hover:border-hew"
                onChange={(e) => setEmailCode(e.target.value)}
              />
            </div>
          )}

          {(mode === MODE.LOGIN || mode === MODE.REGISTER) && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-hew transition duration-300 hover:border-hew"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {mode === MODE.LOGIN && (
            <div
              className="text-sm text-right text-hew hover:underline cursor-pointer"
              onClick={() => setMode(MODE.RESET_PASSWORD)}
            >
              Forgot Password?
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-hew text-white py-2 rounded-md font-semibold transition duration-300 hover:bg-hew-dark hover:shadow-lg transform disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : buttonTitle}
          </button>

          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}
          {message && (
            <div className="text-sm text-green-500 text-center">{message}</div>
          )}
        </form>

        <div className="text-center text-md text-gray-600 space-y-2 mt-4">
          {mode === MODE.LOGIN && (
            <p>
              Don&apos;t have an account?{" "}
              <span
                className="text-hew hover:underline cursor-pointer"
                onClick={() => setMode(MODE.REGISTER)}
              >
                Register here
              </span>
            </p>
          )}
          {mode === MODE.REGISTER && (
            <p>
              Already have an account?{" "}
              <span
                className="text-hew hover:underline cursor-pointer"
                onClick={() => setMode(MODE.LOGIN)}
              >
                Log in here
              </span>
            </p>
          )}
          {mode === MODE.RESET_PASSWORD && (
            <p>
              <span
                className="text-hew hover:underline cursor-pointer"
                onClick={() => setMode(MODE.LOGIN)}
              >
                Back to login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
