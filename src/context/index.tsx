import React, { createContext, useEffect, useState } from "react";
import { IUser } from "../types/user.type";
import { useGetUserDetails } from "@/query/user.queries";
import { useNavigate } from "react-router-dom";

const INITIAL_USER: IUser = {
  _id: "",
  name: "",
  email: "",
  workShops: [],
  picture: "",
  emailVerified: false,
  createdAt: "",
  updatedAt: "",
  subscription: {
    status: "",
    planId: "",
    secondsRemaining: 0,
    concurrentCallLimit: 0,
    cancelAtPeriodEnd: false,
  }
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  setUser: (() => {}) as React.Dispatch<React.SetStateAction<IUser>>,
};

export const UserContext = createContext(INITIAL_STATE);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const navigate = useNavigate();
  const { refetch: getUserDetails, error } = useGetUserDetails();

  const checkAuthUser = async () => {
    try {
      const { data: user } = await getUserDetails();
      if (user && !error) {
        setUser(user);
      } else {
        navigate("/auth/sign-in")
      }
    } catch (error: any) {
      navigate("/auth/sign-in")
      console.error("Auth error:", error.message);
      if (error.response?.status === 504) {
        console.error("Server timeout. Network may be slow or server is overloaded");
      }
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserProvider };