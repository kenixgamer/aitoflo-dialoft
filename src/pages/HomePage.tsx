import Spinner from "@/components/Spinner";
import { UserContext } from "@/context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  if (user?.email) {
    navigate(`/${user?.workShops[0]?._id}/agents`);
  }
  return (
    <div className="flex">
      <div className="w-full flex justify-center items-center h-screen">
        <Spinner />
      </div>
    </div>
  );
};

export default HomePage;
