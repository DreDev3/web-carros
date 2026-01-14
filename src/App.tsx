import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from 'react-hot-toast';

import AuthProvider from "./contexts/AuthContext"


function App() {

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
