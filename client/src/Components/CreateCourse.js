import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateCourse({
  isSignedIn,
  handleSignInCheck,
  userData,
}) {
  let navigate = useNavigate();
  const isFirstRender = useRef(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    estimatedTime: "",
    materialsNeeded: "",
  });
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  useEffect(() => {
    handleSignInCheck();
  }, []);

  useEffect(() => {
    if (isFirstRender.current === false && isSignedIn === false) navigate(`/`);

    if (isFirstRender.current === true) {
      isFirstRender.current = false;
    }
  }, [isSignedIn]);

  function createCourses() {
    const aSecret = localStorage.getItem("somethingNotImportant");
    const loginInfo = btoa(`${userData.emailAddress}:${aSecret}`);
    fetch("http://localhost:5001/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${loginInfo}`,
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        userId: "" + userData.id,
        estimatedTime: formData.estimatedTime,
        materialsNeeded: formData.materialsNeeded,
      }),
    })
      .then((res) => {
        if (!res.ok) throw Error(res.statusText);
        else navigate(`/`);
      })
      .catch((err) => {
        console.log("error here", err);
      });
  }

  function handleCreateCourse(e) {
    e.preventDefault();
    if (formData.title.length > 0 && formData.description.length > 0) {
      createCourses();
    } else {
      setTitleError((p) => (formData.title.length === 0 ? true : false));
      setDescriptionError((p) =>
        formData.description.length === 0 ? true : false
      );
    }
  }

  return (
    <>
      <main>
        <div className="wrap">
          <h2>Create Course</h2>
          {(titleError || descriptionError) && (
            <div className="validation--errors">
              <h3>Validation Errors</h3>
              <ul>
                {titleError && <li>Please provide a value for "Title"</li>}
                {descriptionError && (
                  <li>Please provide a value for "Description"</li>
                )}
              </ul>
            </div>
          )}

          <form>
            <div className="main--flex">
              <div>
                <label htmlFor="title">Course Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                />

                <p>{`By ${userData.firstName} ${userData.lastName}`}</p>

                <label htmlFor="description">Course Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                ></textarea>
              </div>
              <div>
                <label htmlFor="estimatedTime">Estimated Time</label>
                <input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="text"
                  value={formData.estimatedTime}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      estimatedTime: e.target.value,
                    }))
                  }
                />

                <label htmlFor="materialsNeeded">Materials Needed</label>
                <textarea
                  id="materialsNeeded"
                  name="materialsNeeded"
                  value={formData.materialsNeeded}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      materialsNeeded: e.target.value,
                    }))
                  }
                ></textarea>
              </div>
            </div>
            <button
              className="button"
              type="submit"
              onClick={handleCreateCourse}
            >
              Create Course
            </button>
            <button
              className="button button-secondary"
              onClick={() => navigate(`/`)}
            >
              Cancel
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
