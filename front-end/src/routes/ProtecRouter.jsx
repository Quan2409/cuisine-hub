import { useSelector } from "react-redux";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const ProtecRouter = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtecRouter;
