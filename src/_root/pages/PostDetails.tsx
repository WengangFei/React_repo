import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useDeletePost, useGetPostById } from '@/lib/react-query/queriesAndMutations';
import { timeAgo } from '@/lib/utils';
import { RiEditCircleLine } from 'react-icons/ri';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import PostStats from '@/components/shared/PostStats';
import CommentSection from '@/components/shared/CommentSection';
import { IoIosWarning } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from '@radix-ui/react-dialog';
import { toast } from 'sonner';



const PostDetails = () => {

  const { id } = useParams();
  const { data:post, isLoading } = useGetPostById(id || '');
  const { user } = useUserContext();
  //delete post
  const { mutateAsync:deletePost, isPending } = useDeletePost();
  const navigate = useNavigate();
  // console.log('post =>',post);
  const handlePostDelete = async () => {
    try{
      const response = await deletePost({postId:post!.$id,imageId:post!.imageId});
      if(response?.status === 'ok') {
        toast.success('Post deleted successfully!',{
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(to right, #4dff4d, #00cc00)',
            color: '#fff',
            fontWeight: 'bold',
          }
        });
        //direct to home page
        navigate('/');
      }else{
        toast.error('Error deleting post, please try again!',{
          duration: 5000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(to right, #ff0000, #ff7f00)',
            color: '#fff',
            fontWeight: 'bold',
          }
        });
      }
    } catch(error){
      console.log('delete post error =>',error);
    }
  }


  return (
    <div className="post_details-container">
      {
        isLoading ? (
          <Loader content='Loading post......'/>
        ):(
          <div className='post_details-card'>
            <img src={post?.imageUrl || 'image.png'} alt="post" className='post_details-img'/>
            <div className='post_details-info'>
              <div className='flex-between w-full'>
                <Link to={`/profile/${post?.creator.$id}`} className='flex items-center gap-3'>
                      <img src={post?.creator?.imageUrl || 'image.png'} alt="avatar" className='w-7 h-7 rounded-full object-cover'/>
                  
                  <div className='flex flex-col'>
                      <p className='text-sm lg:body-bold text-light-1'>{ post?.creator.name || 'Creator Name'}</p>
                      <div className='flex-center gap-2 text-light-3 text-xs lg:small-regular'>
                          <p className='subtle-semibold lg:small-regular'>{ timeAgo(post!.$createdAt) || 'Created At'}</p>
                          <p className='subtle-semibold lg:small-regular'>{ post?.location || 'Location' }</p>
                      </div>
                  </div>
                </Link>  
                <div className='flex-center gap-2'>
                  <Link to={`/update_post/${post?.$id}`} className={`relative group ${ user.id !== post?.creator.$id && 'hidden'}`}>
                    <RiEditCircleLine className='w-4 h-4 text-purple-500 hover:text-light-1'/>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Edit
                    </span>
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className={`group relative ${ user.id !== post?.creator.$id && 'hidden'}`}> 
                        <MdDelete className=' text-red hover:text-light-1' />
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Delete
                        </span>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm md:max-w-lg bg-dark-2">
                      <DialogHeader>
                        <div className='flex-start gap-2'>
                          <IoIosWarning className='text-yellow-500 w-8 h-8'/>
                          <DialogTitle className='text-red'>Delete Post:</DialogTitle>
                        </div>
                        
                        <DialogDescription className='text-lg text-white'>
                          Are you sure you want to delete this post?<br />
                          This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <div className='flex justify-between w-full'>
                            <Button type="button" variant="secondary">
                              Cancel
                            </Button>
                            <Button type="button" variant="destructive" onClick={ handlePostDelete }>
                              Delete
                            </Button>
                          </div>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  
                </div>
              </div>
              <hr className='border w-full border-dark-4/80'/>
              <div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
                <p>{ post?.caption }</p>
                <ul className='flex gap-1 mt-2'>
                    {
                        post?.tags.map((tag:string) => (
                            <li className='subtle-semibold lg:small-regular' key={tag}>#{tag}</li>
                        ))
                    }
                </ul>
              </div>
              <div className='w-full'>
                  <PostStats post={post} userId={user.id} />
                  <CommentSection postId={post?.$id ?? ''} userId={user.id}/>
              </div>
            </div>
            
        </div>
        )
      }
    </div>
  )
}

export default PostDetails