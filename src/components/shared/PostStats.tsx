import { Models } from 'appwrite'
import { FaRegKissWinkHeart } from "react-icons/fa";
import { FaFaceKissWinkHeart } from "react-icons/fa6";
import { CiSaveUp2 } from "react-icons/ci";
import { useEffect, useState } from 'react';
import { useDeleteSavedPost, useGetCurrentUser, useLikedPost, useSavePost } from '@/lib/react-query/queriesAndMutations';
import { BsSaveFill } from "react-icons/bs";




const PostStats = ({ post, userId }:{ post:Models.Document, userId:string}) => {
  
    const { data: currentUser } = useGetCurrentUser();
    //get saved post
    const savedPost = currentUser?.save.find((record:Models.Document) => record.post?.$id === post?.$id);
    //set saved
    useEffect(() => {
      setIsSaved(!!savedPost);
    },[savedPost]);
    //get current likes array
    const likesArray = post.likes.map((user:Models.Document) => user.$id);
    const [likes, setLikes] = useState(likesArray);
    const [isSaved, setIsSaved] = useState(false);
    //save liked into database
    const { mutateAsync: toggleLikePost } = useLikedPost();
    const { mutateAsync: savePost } = useSavePost();
    const { mutateAsync: deleteSavedPost } = useDeleteSavedPost();
    
    //liked post
    const handleLikePost = (e:React.MouseEvent) => {
      e.stopPropagation();
      let newLikesArray = [...likes];
      if(likes.includes(userId)){
        newLikesArray = newLikesArray.filter((id) => id !== userId);
      } else {
        newLikesArray.push(userId);
      } 
      setLikes(newLikesArray);
      toggleLikePost({ documentId: post.$id, likesArray: newLikesArray });
    };
    //saved post
    const handleSavePost = (e:React.MouseEvent) => {
        e.stopPropagation();
        
        if(savedPost){
            setIsSaved(false);
            deleteSavedPost(savedPost.$id);
        }else{
            setIsSaved(true);
            savePost({ documentId:post.$id, userId });  
        }
    };

  return (
    <div className='flex flex-between items-center z-20'>
        <div className='flex gap-2 mr-5 mt-2'>
            <button onClick={handleLikePost} className='relative flex gap-2 mt-2 group'>
            {
                likes.includes(userId) ? (
                    <FaFaceKissWinkHeart className='text-purple-500 hover:text-light-1 cursor-pointer'/>    
                ) : (
                    <FaRegKissWinkHeart className='text-purple-500 hover:text-light-1 cursor-pointer'/>
                )
            }
             <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {likes.includes(userId) ? 'Liked' : 'Like'}
            </span>
            <p className='small-medium lg:base-medium'>{ likes.length }</p>
            </button>          
        </div>
        <button className='relative flex gap-2 mt-2 group' onClick={handleSavePost}>
        {
            isSaved ? (
                <BsSaveFill className='text-purple-500 hover:text-light-1 cursor-pointer' />
            ) : (
                <CiSaveUp2 className='text-purple-500 hover:text-light-1 cursor-pointer' />
            )
        }
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                { isSaved ? 'Saved' : 'Save' }
            </span>
        </button>
    </div>
    
  )
}

export default PostStats