import { useNavigate } from "react-router-dom";

export default function AllErrors({error}) {
  let navigate = useNavigate();
  return (
    <>
      <div>{error}</div>
      <div>
        <a className="button" onClick={() => navigate(`/`)}>
          Return to List
        </a>
      </div>
    </>
  );
}
