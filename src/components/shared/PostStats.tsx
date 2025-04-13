import { Models } from 'appwrite'
import { FaRegKissWinkHeart } from "react-icons/fa";
import { FaFaceKissWinkHeart } from "react-icons/fa6";
import { CiSaveUp2 } from "react-icons/ci";
import { useState } from 'react';
import { useDeleteSavedPost, useLikedPost, useSavePost } from '@/lib/react-query/queriesAndMutations';
import { BsSaveFill } from "react-icons/bs";
import { useUserContext } from '@/context/AuthContext';
import { TiMessages } from "react-icons/ti";
import { Link } from 'react-router-dom';

// 67fb1427002916ea925b database userid
// 67fb1425716b09c2c84f auth
const PostStats = ({ post, userId }:{ post?:Models.Document, userId:string}) => {
    //check user log in
    const { isAuthenticated, user } = useUserContext();
    const savedPostId = post?.save.find(savedUser => savedUser?.user.$id === user?.id)?.$id;
    // console.log('savedPostId =>',savedPostId);
    //get current likes array
    const likesArray = post?.likes.map((user:Models.Document) => user.$id);
    const savesArray = post?.save.map((user:Models.Document) => user.$id);
    const [likes, setLikes] = useState(likesArray);
    // const [isSaved, setIsSaved] = useState(false);
    const [saves,setSaves] = useState(savesArray);
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
      toggleLikePost({ documentId: post?.$id || '', likesArray: newLikesArray });
    };
    //saved post
    const handleSavePost = (e:React.MouseEvent) => {
        e.stopPropagation();
        //implement on UI level to improve user experience, direct save and get updated number from DB will cause lag of 1-2 seconds
        let savesArray = [...saves];
        if(saves.includes(userId)){
            savesArray = savesArray.filter((id) => id !== userId);
            deleteSavedPost(savedPostId || '');
        } else {
            savesArray.push(userId);
            savePost({ documentId:post?.$id || '', userId });  
        }
        setSaves(savesArray);
    };

    const isAbleToClickButtons = (flag: boolean, content: string, category?: string) => {
        if (flag) {
            let tooltipText = '';
            if (category === 'like') {
                tooltipText = likes.includes(userId) ? 'Unliked' : 'Like';
            } else if (category === 'save') {
                tooltipText = saves.includes(userId) ? 'Unsaved' : 'Save';
            }
    
            return (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {tooltipText}
                </span>
            );
        }
    
        if (category) {
            return (
                <span className="w-20 absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {content}
                </span>
            );
        }
    
        return null;
    };
    

  return (
    <div className='flex flex-between items-center z-20'>
        <div className='flex gap-2 mr-5 mt-2'>
            {/* like button */}
            <button onClick={handleLikePost} className='relative flex gap-2 mt-2 group' disabled={!isAuthenticated}>
            {
                likes.includes(userId) ? (
                    <FaFaceKissWinkHeart className='text-purple-500 hover:text-light-1 cursor-pointer'/>    
                ) : (
                    <FaRegKissWinkHeart className='text-purple-500 hover:text-light-1 cursor-pointer'/>
                )
            }
            { isAbleToClickButtons(isAuthenticated,'login to like','like') }
            <p className='small-medium lg:base-medium'>{ likes.length }</p>
            
            </button>          
        </div>
        {/* comments */}
        <Link to={ isAuthenticated ? `/post/${post?.$id}` : '#'} className='ml-auto mt-5 mr-5 group relative flex gap-2'>
            <TiMessages className='text-purple-500 hover:text-light-1 cursor-pointer'/> 
            {isAbleToClickButtons(isAuthenticated,'login to com.')}
            <p className='small-medium lg:base-medium'>{ likes.length }</p> 
        </Link>
        {/* save button */}
        <button className='relative flex gap-2 mt-5 group' onClick={handleSavePost} disabled={!isAuthenticated}>
            {
                saves.includes(userId) ? (
                    <BsSaveFill className='text-purple-500 hover:text-light-1 cursor-pointer' />
                ) : (
                    <CiSaveUp2 className='text-purple-500 hover:text-light-1 cursor-pointer' />
                )
            }
            { isAbleToClickButtons(isAuthenticated,'login to save','save') }
            <p className='small-medium lg:base-medium '>{ saves.length }</p>
        </button>
    </div>
    
  )
}

export default PostStats