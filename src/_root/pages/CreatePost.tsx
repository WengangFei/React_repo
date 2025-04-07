import PostForm from '@/components/forms/PostForm';
import React from 'react';
import { RiImageAddFill } from "react-icons/ri";

const CreatePost = () => {
  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='w-full flex-start gap-3 '>
          <RiImageAddFill className='cursor-pointer size-6 hover:text-purple-500'/>
          <span className='font-bold w-full'>Create a post</span>
        </div>
        <PostForm action='create'/>
      </div>
    
    </div>
  )
}

export default CreatePost