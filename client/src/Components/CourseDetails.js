import "../styles/global.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CourseDetails({ userData }) {
  let { id } = useParams();
  let navigate = useNavigate();
  const [course, setCourse] = useState({});

  useEffect(() => {
    getCourses();
  }, []);

  function getCourses() {
    fetch("http://localhost:5001/api/courses/" + id)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((res) => {
        setCourse(res);
      })
      .catch((error) => {
        console.log("we cant find the course sorry: " + error);
        navigate(`/notfound`);
      });
  }

  function deleteCourse() {
    const aSecret = localStorage.getItem("somethingNotImportant");
    const loginInfo = btoa(`${userData.emailAddress}:${aSecret}`);
    fetch("http://localhost:5001/api/courses/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${loginInfo}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw Error(res.statusText);
        else navigate(`/`);
      })
      .catch((err) => {
        console.log("error here", err);
      });
  }

  function handleDeleteCourse(e) {
    e.preventDefault();
    deleteCourse();
  }

  return (
    <>
      <main>
        <div className="actions--bar">
          <div className="wrap">
            {Object.keys(userData).length !== 0 &&
              userData.emailAddress === course.User?.emailAddress && (
                <>
                  <a
                    className="button"
                    onClick={() => navigate(`/courses/${id}/update`)}
                  >
                    Update Course
                  </a>
                  <a className="button" onClick={handleDeleteCourse}>
                    Delete Course
                  </a>
                </>
              )}

            <a
              className="button button-secondary"
              onClick={() => navigate(`/`)}
            >
              Return to List
            </a>
          </div>
        </div>

        <div className="wrap">
          <h2>Course Detail</h2>
          <form>
            <div className="main--flex">
              <div>
                <h3 className="course--detail--title">Course</h3>
                <h4 className="course--name">{course?.title}</h4>
                <p>{`By ${course?.User?.firstName} ${course?.User?.lastName}`}</p>
                {course?.description?.split("\n").map((paragraph, i) => {
                  if (paragraph) return <p key={i}>{paragraph}</p>;
                })}
              </div>
              <div>
                <h3 className="course--detail--title">Estimated Time</h3>
                <p>{course?.estimatedTime}</p>

                <h3 className="course--detail--title">Materials Needed</h3>
                <div>
                  <ul className="course--detail--list">
                    {course.materialsNeeded?.split("*").map((material, i) => {
                      if (material) return <li key={i}>{material}</li>;
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default CourseDetails;
