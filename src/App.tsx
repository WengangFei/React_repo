import AuthLayout from "./_auth/AuthLayout";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import { Home, Explore, People, CreatePost, Saved, PostDetails, Profile, UpdateProfile, EditPost } from "./_root/pages";
import RootLayout from "./_root/RootLayout";
import Chef from "./components/chef/Chef"
import MyCV from "./components/CV/MyCV"

import './globals.css'
import { Routes, Route } from "react-router-dom";  
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'




function App() {

  return (
    
      <main className="flex h-screen">
        {/* <Chef /> */}
        {/* <MyCV /> */}
        <Toaster />
        <Routes>
          {/* public route */}
          <Route element={<AuthLayout />} >
            <Route path="/sign-in" element={<SigninForm />} />
            <Route path="/sign-up" element={<SignupForm />} />
          </Route>
        
          {/* private route */}
          <Route element={<RootLayout />} >
            <Route index element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/people"  element={<People />} />
            <Route path="/create_post" element={<CreatePost /> } />
            <Route path="/saved" element={<Saved /> } />
            <Route path="/update_post/:id" element={<EditPost /> } />
            <Route path='/post/:id' element={<PostDetails />} />
            <Route path='/profile/:id/*' element={<Profile />} />
            <Route path='/update_profile/:id' element={<UpdateProfile />} />
          </Route>
        </Routes> 
        
        <ReactQueryDevtools initialIsOpen={false} />
      </main>
      
    
  )
}

export default App
 