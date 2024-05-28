// UserContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const { currentAuthUser } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (currentAuthUser) {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/user/${currentAuthUser.uid}`
          );
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchUserDetails();
  }, [currentAuthUser]);

  const value = { currentUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
