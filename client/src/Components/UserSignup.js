import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserSignup({ getUser }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    firstNameError: false,
    lastNameError: false,
    emailAddressError: false,
    passwordError: false,
    emailExistsError: false,
  });
  let navigate = useNavigate();

  function createUser(body) {
    fetch("http://localhost:5001/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        password: formData.password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          getUser(formData.emailAddress, formData.password);
        } else {
          throw new Error(res.status);
        }
      })
      .catch((error) => {
        setErrors((p) => ({
          firstNameError: formData?.firstName?.length === 0 ? true : false,
          lastNameError: formData?.lastName?.length === 0 ? true : false,
          emailAddressError:
            formData?.emailAddress?.length === 0 ? true : false,
          password: formData?.password?.length === 0 ? true : false,
          emailExistsError: true,
        }));
        console.log("error here buddy", error);
      });
  }

  function handleSignUpSubmit(e) {
    e.preventDefault();

    // IT WOULD BE DUMB TO DO THIS IN A REAL APPLICATION
    localStorage.setItem("somethingNotImportant", formData.password);

    if (
      formData?.firstName?.length > 0 &&
      formData?.lastName?.length > 0 &&
      formData?.emailAddress?.length > 0 &&
      formData?.password?.length > 0
    ) {
      createUser();
    } else {
      setErrors(() => ({
        firstNameError: formData?.firstName?.length === 0 ? true : false,
        lastNameError: formData?.lastName?.length === 0 ? true : false,
        emailAddressError: formData?.emailAddress?.length === 0 ? true : false,
        password: formData?.password?.length === 0 ? true : false,
        emailExistsError: false,
      }));
    }
  }

  return (
    <>
      <main>
        <div className="form--centered">
          <h2>Sign Up</h2>
          {(errors.firstNameError ||
            errors.lastNameError ||
            errors.emailAddressError ||
            errors.passwordError ||
            errors.emailExistsError) && (
            <div className="validation--errors">
              <h3>Validation Errors</h3>
              <ul>
                {errors.firstNameError && (
                  <li>Please provide a value for "First Name"</li>
                )}
                {errors.lastNameError && (
                  <li>Please provide a value for "Last Name"</li>
                )}
                {errors.emailAddressError && (
                  <li>Please provide a value for "Email Address"</li>
                )}
                {errors.passwordError && (
                  <li>Please provide a value for "Password"</li>
                )}
                {errors.emailExistsError && (
                  <li>Entered email already exists!</li>
                )}
              </ul>
            </div>
          )}
          <form onSubmit={handleSignUpSubmit}>
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              onChange={(e) =>
                setFormData((p) => ({ ...p, firstName: e.target.value }))
              }
            />
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              onChange={(e) =>
                setFormData((p) => ({ ...p, lastName: e.target.value }))
              }
            />
            <label htmlFor="emailAddress">Email Address</label>
            <input
              id="emailAddress"
              name="emailAddress"
              type="email"
              onChange={(e) =>
                setFormData((p) => ({ ...p, emailAddress: e.target.value }))
              }
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={(e) =>
                setFormData((p) => ({ ...p, password: e.target.value }))
              }
            />
            <button className="button" type="submit">
              Sign Up
            </button>
            <button
              className="button button-secondary"
              onClick={() => navigate(`/`)}
            >
              Cancel
            </button>
          </form>
          <p>
            Already have a user account? Click here to{" "}
            <a onClick={() => navigate(`/signin`)}>sign in</a>!
          </p>
        </div>
      </main>
    </>
  );
}
