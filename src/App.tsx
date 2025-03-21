import AuthLayout from "./_auth/AuthLayout";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import { Home } from "./_root/pages";
import RootLayout from "./_root/RootLayout";
import Chef from "./components/chef/Chef"
import MyCV from "./components/CV/MyCV"

import './globals.css'
import { Routes, Route } from "react-router-dom";  

function App() {

  return (
    <main className="flex h-screen">
      {/* <Chef /> */}
      {/* <MyCV /> */}
      <Routes>
        {/* public route */}
        <Route element={<AuthLayout />} >
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
       
        {/* private route */}
        <Route element={<RootLayout />} >
          <Route index element={<Home />} />
        </Route>
      </Routes> 
    </main>
  )
}

export default App
 