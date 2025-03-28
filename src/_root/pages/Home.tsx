
import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';

import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { toast } from 'sonner';


const Home = () => {

  const { data, isLoading, isError }  = useGetRecentPosts();

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>
            {
              isLoading ? (
                <Loader content='Loading posts......'/>
              ):(
                <ul className='flex flex-col flex-1 gap-9 w-full'>
                  {
                    data && data.map((post:Models.Document)=>(
                        <PostCard post={post} key={post.$id}/>
                      )
                    )
                  }
                </ul>
              )
            }
        </div>
        { isError && toast.error('Error uploading posts, please try again!') }
      </div>
    </div>
  )
}

export default Home