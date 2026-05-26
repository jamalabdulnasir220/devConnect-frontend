import { Navigate, Outlet, useLocation, useOutletContext } from "react-router";
import { useSelector } from "react-redux";
import { selectUser } from "../api/userSlice";

const ProtectedRoute = () => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const { sessionChecked } = useOutletContext();

  if (!sessionChecked) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
