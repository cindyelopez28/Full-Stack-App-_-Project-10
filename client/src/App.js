//import components 
import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import CourseDetails from "./Components/CourseDetails";
import Courses from "./Components/Courses";
import CreateCourse from "./Components/CreateCourse";
import UpdateCourse from "./Components/UpdateCourse";
import UserSignin from "./Components/UserSignin";
import UserSignup from "./Components/UserSignup";
import UserSignOut from "./Components/UserSignOut";
import Header from "./Components/Header";
import AllErrors from "./Components/AllErrors";
import Private from "./Components/Private";
function App() {
  let navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState({
    isSignedIn: false,
    userData: {},
  });

  useEffect(() => {
    handleSignInCheck();
  }, []);

  function handleSignInCheck() {
    const loggedInUser = localStorage.getItem("user");

    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setIsSignedIn({ isSignedIn: true, userData: foundUser });
    } else {
      setIsSignedIn({ isSignedIn: false, userData: {} });
    }
  }

  function handleUserSignIn(isValidated, userData) {
    if (isValidated) {
      localStorage.setItem("user", JSON.stringify(userData));
      setIsSignedIn({ isSignedIn: true, userData: userData });
    } else {
      setIsSignedIn({ isSignedIn: false, userData: {} });
    }
  }

  function getUser(userName, password) {
    const loginInfo = btoa(`${userName}:${password}`);
    fetch("http://localhost:5001/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${loginInfo}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message && res.message === "Passwords dont match") {
          handleUserSignIn(false, {});
        } else {
          handleUserSignIn(true, res);
          navigate(`/`);
        }
      });
  }

  return (
    <div className="App">
      <Header
        isSignedIn={isSignedIn.isSignedIn}
        userData={isSignedIn.userData}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Courses
              isSignedIn={isSignedIn.isSignedIn}
              userData={isSignedIn.userData}
            />
          }
        />
        <Route
          path="/courses"
          element={
            <Courses
              isSignedIn={isSignedIn.isSignedIn}
              userData={isSignedIn.userData}
            />
          }
        />
        <Route
          path="courses/create"
          element={
            <Private redirectPath="/" isAllowed={isSignedIn.isSignedIn}>
              <CreateCourse
                handleSignInCheck={handleSignInCheck}
                isSignedIn={isSignedIn.isSignedIn}
                userData={isSignedIn.userData}
              />
            </Private>
          }
        />
        <Route
          path="courses/:id/update"
          element={
            <Private redirectPath="/" isAllowed={isSignedIn.isSignedIn}>
              <UpdateCourse
                handleSignInCheck={handleSignInCheck}
                isSignedIn={isSignedIn.isSignedIn}
                userData={isSignedIn.userData}
              />
            </Private>
          }
        />
        {/* <Route
          path="courses/create"
          element={
            <CreateCourse
              handleSignInCheck={handleSignInCheck}
              isSignedIn={isSignedIn.isSignedIn}
              userData={isSignedIn.userData}
            />
          }
        /> */}
        {/* <Route
          path="courses/:id/update"
          element={
            <UpdateCourse
              handleSignInCheck={handleSignInCheck}
              isSignedIn={isSignedIn.isSignedIn}
              userData={isSignedIn.userData}
            />
          }
        /> */}
        <Route
          path="courses/:id"
          element={
            <CourseDetails
              isSignedIn={isSignedIn.isSignedIn}
              userData={isSignedIn.userData}
            />
          }
        />

        <Route
          path="signin"
          element={
            <UserSignin
              isSignedIn={isSignedIn.isSignedIn}
              handleUserSignIn={handleUserSignIn}
              handleSignInCheck={handleSignInCheck}
              userData={isSignedIn.userData}
              getUser={getUser}
            />
          }
        />
        <Route
          path="signup"
          element={
            <UserSignup
              isSignedIn={isSignedIn.isSignedIn}
              handleUserSignIn={handleUserSignIn}
              userData={isSignedIn.userData}
              getUser={getUser}
            />
          }
        />
        <Route
          path="signout"
          element={<UserSignOut handleUserSignIn={handleUserSignIn} />}
        />
        <Route
          path="notfound"
          element={<AllErrors error={"Course Not Found"} />}
        />
        <Route
          path="forbidden"
          element={<AllErrors error={"Forbidden Access"} />}
        />
        <Route
          path="error"
          element={<AllErrors error={"500 Internal Server Error"} />}
        />
        <Route
          path="*"
          element={<AllErrors error={"Route does not exist"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
