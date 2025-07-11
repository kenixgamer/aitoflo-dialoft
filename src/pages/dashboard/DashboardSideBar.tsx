import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, Outlet, useNavigate } from "react-router-dom";
import WorkShopLists from "../../components/WorkShop/WorkShopLists";
import { useContext } from "react";
import { UserContext } from "@/context";
import { useLogOut } from "@/query/user.queries";
import {
  AssistantIcon,
  BookIcon,
  PhoneIcon,
  FileIcon,
  HistoryIcon,
  // MoneyIcon,
  LogoutIcon,
  MoneyIcon,
  HelpIcon,
  ActionsIcon,
} from "@/utils/icons/icons";
import { capitalizeFirstLetter } from "@/utils";

const DashboardSideBar = () => {
  const { user } = useContext(UserContext);
  // const { data: subscriptionData } = useSubscriptionStatus();
  const { mutateAsync: logOut } = useLogOut();
  const navigate = useNavigate();
  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/auth/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  const getMaxSeconds = (planName?: string) => {
    switch (planName?.toLowerCase()) {
      case "starter":
        return 150 * 60;
      case "professional":
        return 1000 * 60;
      case "business":
        return 2500 * 60;
      case "agency":
        return 5000 * 60;
      case "trial":
      default:
        return 10 * 60;
    }
  };

  const menuItems = [
    { name: "Agents", icon: <AssistantIcon />, path: "agents" },
    { name: "Knowledge Base", icon: <BookIcon />, path: "knowledgebase" },
    { name: "Phone Numbers", icon: <PhoneIcon />, path: "phone-numbers" },
    { name: "Batch Call", icon: <FileIcon />, path: "batch-call" },
    { name: "Actions", icon: <ActionsIcon />, path: "actions" },
    { name: "Call History", icon: <HistoryIcon />, path: "call-history" },
    { name: "Billing", icon: <MoneyIcon />, path: "billing" },
  ];

  return (
    <div className="flex min-h-screen max-h-screen bg-black text-white">
      <aside className="w-72 border-r border-zinc-800 flex flex-col">
        <nav className="flex flex-col flex-1 justify-between">
          

          {/* Workspace */}
          <div className="flex flex-col space-y-2">
            {/* Logo */}
          <div className="flex items-center pl-2 gap-4 mb-2 mt-4 justify-start">
            <img
              src="/logo.jpg"
              alt="logo"
              className="w-10 h-10 object-contain"
            />
                          <div className="font-bold text-lg">Aitoflo</div>
          </div>
            <WorkShopLists />

            {/* Menu Items */}
            <ul className="mt-2 text-white">
              {menuItems.map((item, index) => (
                <li className="pt-1" key={index}>
                  <Link
                    className="flex items-center space-x-3 py-2 px-4 hover:bg-zinc-900 transition-colors"
                    to={item.path}
                  >
                    {item.icon}
                    <span className="text-lg">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col space-y-2 mb-4">
            {/* Free Trial - Moved to bottom */}
            <div className="p-4 text-sm bg-zinc-900 mx-2 rounded-md border border-zinc-800">
              <div className="font-bold py-2 text-base">
                {capitalizeFirstLetter(user?.subscription?.planId)}
              </div>
              <div className="text-zinc-400 py-1">
                Remaining:{" "}
                <span className="text-purple-500 font-medium">
                  {(() => {
                    const seconds = user?.subscription?.secondsRemaining || 0;
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = Math.floor(seconds % 60);
                    return `${minutes}:${remainingSeconds
                      .toString()
                      .padStart(2, "0")}`;
                  })()}{" "}
                  minutes
                </span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max={getMaxSeconds(user?.subscription?.planId)}
                  step="0.01"
                  value={user?.subscription?.secondsRemaining || 0}
                  className="w-full bg-zinc-900 accent-purple-600 hover:accent-purple-500"
                  readOnly
                />
              </div>
              <a
                href="https://calendly.com/gurleen-aitoflo/introduction-to-aitoflo-1?month=2025-07"
                target="_blank"
                className="mt-2 w-full inline-flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 shadow-[0_0_10px_rgba(147,51,234,0.3)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z" />
                </svg>
                Upgrade Plan
              </a>
            </div>

            {/* User Info - Moved to bottom */}
            <div className="p-3 bg-zinc-900 rounded-md mx-2 flex items-center space-x-2 border border-zinc-800">
              <img
                src={user.picture}
                onError={(e) => (e.currentTarget.src = "/logo.jpg")}
                className="w-8 h-8 rounded-full object-contain"
              />
              <span className="truncate text-sm">{user?.email}</span>
              <div className="relative ml-auto h-5 w-5">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M14.3105 7.94623L10 3.63574L5.68956 7.94623L6.67165 8.92835L10 5.59992L13.3284 8.92835L14.3105 7.94623ZM5.68945 12.0534L9.99996 16.364L14.3104 12.0534L13.3284 11.0713L9.99996 14.3997L6.67154 11.0713L5.68945 12.0534Z"
                        fill="#4c1d95"
                      ></path>
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black border-zinc-800 hover:text-white text-white">
                    <DropdownMenuItem
                      onClick={handleLogOut}
                      className="hover:bg-zinc-900 hover:text-white text-white focus:bg-zinc-900"
                    >
                      <LogoutIcon />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Help & Support Button */}
            <Link
              to="support"
              className="p-4 mx-2 flex items-center space-x-3 bg-zinc-900 rounded-md border border-zinc-800 hover:bg-zinc-800 transition-colors"
            >
              <HelpIcon />
              <span className="text-sm">Help & Support</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardSideBar;
