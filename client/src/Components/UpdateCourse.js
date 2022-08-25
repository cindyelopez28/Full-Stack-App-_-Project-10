import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateCourse({
  isSignedIn,
  handleSignInCheck,
  userData,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [materialsNeeded, setMaterialsNeeded] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  let navigate = useNavigate();
  let { id } = useParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    handleSignInCheck();
  }, []);

  // SIGNED OUT USER CAN NOT UPDATE A COURSE OR CREATE A COURSE
  // first render always returns false which results in a premature reroute to the home page
  // we need to wait for handleSignInCheck to re-render the component so we can first check
  // to see if the user is signed in. then we decide if we should reroute to the home page
  // first render does not produce results from handleSignInCheck
  useEffect(() => {
    if (isFirstRender.current === false && isSignedIn === false) navigate(`/`);

    if (isFirstRender.current === true) {
      isFirstRender.current = false;
    }
  }, [isSignedIn]);

  useEffect(() => {
    function fetchData() {
      fetch("http://localhost:5001/api/courses/" + id)
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .then((data) => {
          const { title, description, estimatedTime, materialsNeeded, User } =
            data;

          if (User.emailAddress !== userData.emailAddress)
            throw new Error("course does not belong to user");

          setTitle(title || "");
          setDescription(description || "");
          setEstimatedTime(estimatedTime || "");
          setMaterialsNeeded(materialsNeeded || "");
        })
        .catch((error) => {
          if (error === "course does not belong to user")
            navigate(`/forbidden`);
          else if (error === "500 Internal Server Error") {
            navigate(`/error`);
          } else {
            navigate(`/notfound`);
          }
        });
    }
    fetchData();
  }, [id]);

  function updateCourse() {
    const aSecret = localStorage.getItem("somethingNotImportant");
    const loginInfo = btoa(`${userData.emailAddress}:${aSecret}`);
    fetch("http://localhost:5001/api/courses/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${loginInfo}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        materialsNeeded: materialsNeeded,
        estimatedTime: estimatedTime,
        userId: userData.id,
      }),
    })
      .then((res) => {
        if (!res.ok) throw Error(res.statusText);
        else navigate(`/courses/${id}`);
      })
      .catch((err) => {
        console.log("error here", err);
      });
  }

  function handleUpdateCourse(e) {
    e.preventDefault();
    // only make fetch call if all the data is present on the form
    if (title.length > 0 && description.length > 0) {
      updateCourse();
    } else {
      setTitleError((p) => (title.length === 0 ? true : false));
      setDescriptionError((p) => (description.length === 0 ? true : false));
    }
  }

  return (
    <>
      <main>
        <div className="wrap">
          <h2>Update Course</h2>
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
                <label htmlFor="courseTitle">Course Title</label>
                <input
                  id="courseTitle"
                  name="courseTitle"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <p>{`By ${userData?.firstName} ${userData?.lastName}`}</p>

                <label htmlFor="courseDescription">Course Description</label>
                <textarea
                  id="courseDescription"
                  name="courseDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label htmlFor="estimatedTime">Estimated Time</label>
                <input
                  id="estimatedTime"
                  name="estimatedTime"
                  type="text"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                />

                <label htmlFor="materialsNeeded">Materials Needed</label>
                <textarea
                  id="materialsNeeded"
                  name="materialsNeeded"
                  value={materialsNeeded}
                  placeholder="Please place an asterisk(*) in between each material"
                  onChange={(e) => setMaterialsNeeded(e.target.value)}
                ></textarea>
              </div>
            </div>
            <button
              className="button"
              type="submit"
              onClick={handleUpdateCourse}
            >
              Update Course
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
