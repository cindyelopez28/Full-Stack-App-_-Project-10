import "../styles/global.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Courses({ userData }) {
  let navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  function handleNewCourseClick() {
    if (Object.keys(userData).length === 0) {
      navigate(`/signin`);
    } else {
      navigate(`/courses/create`);
    }
  }

  useEffect(() => {
    getCourses();
  }, []);

  function getCourses() {
    fetch("http://localhost:5001/api/courses")
      .then((res) => res.json())
      .then((res) => {
        setCourses(res);
      });
  }

  return (
    <>
      <main>
        <div className="wrap main--grid">
          {courses.map((course, i) => {
            return (
              <a
                className="course--module course--link"
                key={i}
                onClick={() => navigate(`courses/${course.id}`)}
              >
                <h2 className="course--label">Course</h2>
                <h3 className="course--title">{course.title}</h3>
              </a>
            );
          })}

          <a
            className="course--module course--add--module"
            onClick={handleNewCourseClick}
          >
            <span className="course--add--title">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 13 13"
                className="add"
              >
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
              New Course
            </span>
          </a>
        </div>
      </main>
    </>
  );
}

export default Courses;
