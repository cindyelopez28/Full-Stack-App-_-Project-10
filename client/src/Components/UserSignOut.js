import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function UserSignOut({handleUserSignIn}) {
    let navigate = useNavigate();
    useEffect(() => {
        handleUserSignIn(false, {});
        localStorage.clear();
        navigate(`/`);
    },[])

    return <></>
}

export default UserSignOut;