import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { apiEndpoint } from "../constants/constants";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const { currentAuthUser, setRegistering } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (currentAuthUser) {
        try {
          const response = await axios.get(
            apiEndpoint + `/user/${currentAuthUser.uid}`
          );
          setCurrentUser(response.data);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    };

    fetchUserDetails();
  }, [currentAuthUser]);

  const value = { currentUser, setRegistering, loading };
  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
