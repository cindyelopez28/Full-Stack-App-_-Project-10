import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Header({ isSignedIn, userData, handleUserSignIn }) {
  let navigate = useNavigate();

  return (
    <div className="wrap header--flex">
      <h1 className="header--logo">
        <a onClick={() => navigate(`/`)}>Courses</a>
      </h1>
      <nav>
        <ul className="header--signedout">
          {isSignedIn ? (
            <>
              <li>
                <span>{`Welcome ${userData.firstName} ${userData.lastName}`}</span>
              </li>
              <li>
                <a onClick={() => navigate(`signout`)}>Sign Out</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a onClick={() => navigate(`/signup`)}>Sign Up</a>
              </li>
              <li>
                <a onClick={() => navigate(`/signin`)}>Sign In</a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Header;
