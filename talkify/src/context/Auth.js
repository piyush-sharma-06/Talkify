import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Loading from "../Components/Loading";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  if (loading) return <Loading />;
  // else {
  //      return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
  // }
  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
