import { timeAgo } from '@/lib/utils'
import { Models } from 'appwrite'
import { Link } from 'react-router-dom'
import { RiEditCircleLine } from "react-icons/ri";
import { useUserContext } from '@/context/AuthContext';
import PostStats from './PostStats';


const PostCard = ({ post }:{ post:Models.Document}) => {
    //retrieve user 
    const { user } = useUserContext();
    if(!post.creator) return;
    
  return (
    <div className='post-card'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
            <Link to={`/profile/${post.creator.$id}`}>
                <img src={post?.creator?.imageUrl || 'image.png'} alt="avatar" className='w-7 h-7 rounded-full object-cover'/>
            </Link>
            <div className='flex flex-col'>
                <p className='text-sm lg:body-bold text-light-1'>{ post.creator.name || 'Creator Name'}</p>
                <div className='flex-center gap-2 text-light-3 text-xs lg:small-regular'>
                    <p className='subtle-semibold lg:small-regular'>{ timeAgo(post.$createdAt) || 'Created At'}</p>-
                    <p className='subtle-semibold lg:small-regular'>{ post.location || 'Location' }</p>
                </div>
            </div>
        </div>
        <Link to={`/update_post/${post.$id}`} className={`${user.id !== post.creator.$id && 'hidden'}`}>
            <RiEditCircleLine className='w-5 h-5 text-purple-500 hover:text-light-1'/>
        </Link>
      </div>
      <Link to={`/post/${post.$id}`}>
        <div className='small-medium lg:base-medium py-2'>
            <p>{ post.caption }</p>
            <ul className='flex gap-1 mt-2'>
                {
                    post.tags.map((tag:string) => (
                        <li className='subtle-semibold lg:small-regular' key={tag}>#{tag}</li>
                    ))
                }
            </ul>
        </div>
        <img src={post.imageUrl} alt="postImage" className='w-full h-80 lg:h-[480px] object-cover rounded-[24px] mt-5'/>
      </Link>
      <PostStats post={post} userId={user.id}/>
    </div>
  )
}

export default PostCard