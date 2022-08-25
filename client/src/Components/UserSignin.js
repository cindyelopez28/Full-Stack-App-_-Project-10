import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UserSignin({
  isSignedIn,
  handleSignInCheck,
  getUser,
}) {
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  let navigate = useNavigate();

  useEffect(() => {
    handleSignInCheck();
  }, []);

  useEffect(() => {
    if (isSignedIn) navigate(`/`);
  }, [isSignedIn]);

  function handleSignInSubmit(e) {
    e.preventDefault();
    localStorage.setItem('somethingNotImportant', password);
    getUser(userName, password);
  }

  return (
    <>
      <main>
        <div className="form--centered">
          <h2>Sign In</h2>

          <form onSubmit={handleSignInSubmit}>
            <label htmlFor="emailAddress">Email Address</label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="email"
              onChange={(e) => setUserName(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="button"
              type="submit"
              onClick={handleSignInSubmit}
            >
              Sign In
            </button>
            <button
              className="button button-secondary"
              onClick={() => navigate(`/`)}
            >
              Cancel
            </button>
          </form>
          <p>
            Don't have a user account? Click here to{" "}
            <a onClick={() => navigate(`/signup`)}>sign up</a>!
          </p>
        </div>
      </main>
    </>
  );
}
