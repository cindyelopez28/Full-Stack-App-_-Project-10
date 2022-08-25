import { useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function Private({ isAllowed, redirectPath, children }) {
  const isFirstRender = useRef(true);
  if (isFirstRender.current === false && !isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  isFirstRender.current = false;
  return children ? children : <Outlet />;
}
