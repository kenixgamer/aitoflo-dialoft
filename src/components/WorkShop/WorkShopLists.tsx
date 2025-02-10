import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserContext } from "@/context";
import { useContext, useState } from "react";
import { useCreateWorkShop } from "@/query/workshop.queries";
import { useParams, useNavigate } from "react-router-dom";
import { formatWorkshopName } from "@/utils/helperFunctions";
import AlertInputDialog from "../AlertInputDialog";

const WorkShopLists = () => {
  const { workshopId } = useParams();
  if (!workshopId) {
    return <p>Error...</p>;
  }
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const getWorkshop = (workshopId: string) => {
    const { user } = useContext(UserContext);
    const workshop = user.workShops.find(
      (workshop: any) => workshop._id === workshopId
    );
    return workshop;
  };
  const workshop = getWorkshop(workshopId);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const { mutateAsync: createWorkShop } = useCreateWorkShop();
  const [newWorkShopName, setNewWorkShopName] = useState("");
  const handleCreateWorkShop = async () => {
    if (!newWorkShopName) {
      return;
    }
    await createWorkShop(newWorkShopName);
    setShowAlertDialog(false);
  };

  return (
    <>
      <div className="p-3 bg-black border border-zinc-800 rounded-md mx-2 flex items-center space-x-2 hover:border-zinc-700 transition-colors">
        <span className="bg-purple-600 h-6 w-6 rounded-full flex items-center justify-center text-xs text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]">
          {workshop?.name?.toString().slice(0, 1).toUpperCase()}
        </span>
        <span className="truncate text-sm text-white">
          {formatWorkshopName(workshop?.name ?? "")} Workspace
        </span>
        <div className="relative ml-auto h-5 w-5">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14.3105 7.94623L10 3.63574L5.68956 7.94623L6.67165 8.92835L10 5.59992L13.3284 8.92835L14.3105 7.94623ZM5.68945 12.0534L9.99996 16.364L14.3104 12.0534L13.3284 11.0713L9.99996 14.3997L6.67154 11.0713L5.68945 12.0534Z" 
                fill="#9333EA"/>
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-zinc-800 text-white min-w-[200px]">
              {user?.workShops?.length > 0 &&
                user.workShops.map((workShop: any) => (
                  <DropdownMenuItem
                    key={workShop._id}
                    onClick={() => navigate(`/${workShop._id}/agents`)}
                    className="my-1 cursor-pointer hover:bg-zinc-800 transition-colors flex items-center px-3 py-2 focus:bg-zinc-800"
                  >
                    <span className="bg-purple-600 h-6 w-6 rounded-full flex items-center justify-center text-xs text-white mr-2 shadow-[0_0_10px_rgba(147,51,234,0.3)]">
                      {workShop.name.toString().slice(0, 1).toUpperCase()}
                    </span>
                    <span className="text-white text-sm">
                      {workShop.name}
                    </span>
                  </DropdownMenuItem>
                ))}
              <hr className="my-2 border-zinc-800" />
              <AlertInputDialog
                title="Add Workspace"
                placeholder="Enter workspace name"
                onSave={handleCreateWorkShop}
                showAlertDialog={showAlertDialog}
                setShowAlertDialog={setShowAlertDialog}
                textValue={newWorkShopName}
                setTextValue={setNewWorkShopName}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default WorkShopLists;