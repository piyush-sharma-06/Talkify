import React, { useState } from "react";
import Button from "../../Components/Button";
import { Link } from "react-router-dom";
import { Alert, TextField } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });
  const history = useHistory();
  const [emailError, setEmailError] = useState("");
  const [emailErrorVisibility, setEmailErrorVisibility] = useState(false);
  const { email, password, error, loading } = data;
  const handleChange = (event) => {
    setData({ ...data, [event.target.id]: event.target.value });
  };
  const handleError = (code) => {
    switch (code) {
      case "auth/user-not-found":
        setEmailError("User not found Please register yourself");
        setEmailErrorVisibility(true);
        break;
      case "auth/wrong-password":
        setEmailError("password is wrong");
        setEmailErrorVisibility(true);
        break;
      case "auth/invalid-email":
        setEmailError("invalid email");
        setEmailErrorVisibility(true);
        break;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" });
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // firestore
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
      setData({
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      history.replace("/");
      console.log(result.user);
    } catch (err) {
      handleError(err.code);
      console.log(err);
      setData({ ...data, error: err.message, loading: false });
    }
  };
  return (
    <div
      className="w-3/6 mx-auto my-8 p-4 border
    -4 bg-white rounded-lg shadow-2xl "
    >
      <h1 className="mt-4 font-serif text-4xl font-semibold text-center">
        Talkify
      </h1>
      <p className="mt-4 text-sm font-semibold text-center">
        Join the community to chat with your freinds
      </p>
      <form
        component="form"
        className="mx-6 mt-4 text-center"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col space-y-6 items-center">
          <TextField
            label="Email"
            id="email"
            variant="outlined"
            size="small"
            value={data.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            id="password"
            variant="outlined"
            type="password"
            size="small"
            value={data.passwordl}
            onChange={handleChange}
            required
          />
        </div>
        {error
          ? emailErrorVisibility && (
              <Alert
                onClose={() => {
                  setEmailErrorVisibility(false);
                }}
                className="absolute left-0 right-0 mx-auto transition duration-1000 ease-in-out w-96 top-10"
                severity="error"
              >
                {emailError}
              </Alert>
            )
          : null}
        <p className="mt-3 text-sm font-semibold text-center cursor-pointer">
          Already have an account?{" "}
          <Link to="/register">
            <span className="hover:underline">Register</span>
          </Link>
        </p>
        <Button className="mt-3 block ml-auto w-28" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
