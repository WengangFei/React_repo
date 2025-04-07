import PostForm from '@/components/forms/PostForm'
import Loader from '@/components/shared/Loader';
import { useGetPostById } from '@/lib/react-query/queriesAndMutations';
import { RiImageAddFill } from 'react-icons/ri'
import { useParams } from 'react-router-dom';


const EditPost = () => {
  //get post id
  const { id } = useParams();

  //get the post
  const { data, isLoading } = useGetPostById(id || '');

  return (
    <div className='flex flex-1'>
      <div className='common-container'>
        <div className='w-full flex-start gap-3 '>
          <RiImageAddFill className='cursor-pointer size-6 hover:text-purple-500'/>
          <span className='font-bold w-full'>Edit the post</span>
        </div>
        { 
          isLoading ? <Loader content='Loading post......'/> : 
          <PostForm actions='update' post={data} />
        }
      </div>
    
    </div>
  )
}

export default EditPost