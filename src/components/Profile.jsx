import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import { selectUser } from "../api/userSlice";
import PageHeader from "./PageHeader";

const Profile = () => {
  const user = useSelector(selectUser);
  if (!user) return null;

  return (
    <>
      <PageHeader
        title="Your profile"
        description="How others see you in Discover — keep it fresh"
      />
      <EditProfile user={user} />
    </>
  );
};

export default Profile;
