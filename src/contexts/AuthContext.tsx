import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../services/firebaseConnection";

interface AuthProviderProps {
  children: ReactNode
}

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid }: UserData) => void;
  user: UserData | null;
}
type UserData = {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthContext = createContext({} as AuthContextData);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) {
        setUser({
          uid: user.uid,
          name: user?.displayName,
          email: user?.email
        })
        setLoadingAuth(false);
      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    })

    return () => {
      unsub();
    }
  }, [])

  function handleInfoUser({ name, email, uid }: UserData) {
    setUser({
      name,
      email,
      uid
    })
  }
  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth,
        handleInfoUser,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}