import { createContext, useContext, useEffect, useState } from "react";
import IdleMonitor from "./IdleMonitor";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [adminName, setAdminName] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState(null);
  const [facultyId, setFacultyId] = useState(null);
  const [facultyName, setFacultyName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    localStorage.setItem("token", serverToken);
  };

  let isLoggedIn = !!token;
  console.log("token", token);
  console.log("isLoggedIn", isLoggedIn);  

  const LogoutUser = () => {
    setToken("");
    setStudentId(null);
    localStorage.removeItem("token");
  };
  const userAuthentication = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/auth/user", {
            method: "GET",
            headers: {
                Authorization: authorizationToken, 
            },
        });

        if (response.ok) {
            const data = await response.json();
            setUser(data);
            console.log("User data fetched: ",data);
            if (data) {
              setUser(data);
              console.log("User data after setting state:", data); 
              setStudentId(data.student?.id); 
              setAdminName(data.ADMIN?.username);
              setStudentName(data.student?.name);
              setFacultyId(data.faculty?.id);
              setFacultyName(data.faculty?.name);
              setIsLoading(false);
          } else {
              console.error("No data returned from API.");
          }
        } else {
            console.error("Error fetching user data", response.status);
            setIsLoading(false);
            if (response.status === 401) {
                toast.error("Session expired. Please login again.");
                LogoutUser();
            }
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
    }
};


  useEffect(() => {
    userAuthentication();
  }, [token]);

  useEffect(() => {
    console.log("User data at last: ",user); 
    console.log("User role: ",user.role);
    
  }, [user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, storeTokenInLS, LogoutUser,adminName,facultyName,studentName, user ,facultyId, studentId, authorizationToken, isLoading }}>
      {token && <IdleMonitor />}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }
  return authContextValue;
};
