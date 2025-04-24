import ProfileHead from '@/components/shared/ProfileHead'
import { useUserContext } from '@/context/AuthContext';
import React from 'react'
import MyAllPosts from './MyAllPosts';
import MyAllComments from '@/components/shared/MyAllComments';

const Profile = () => {

  const { loginUser:user } = useUserContext();
  console.log("user =>",user)
  return (
    <div className='flex justify-center lg:mt-10'>
      <div className='w-[300px]'>
        <ProfileHead user={user}/>
      </div>
      <div className='w-full'>
        <MyAllPosts posts={user.posts}/>
        <hr className='w-full border-purple-600 '/>
        <MyAllComments comments={user.comments}/>
      </div>
      
   
    </div>
  )
}

export default Profile