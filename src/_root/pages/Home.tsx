
import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import { useUserContext } from '@/context/AuthContext';
import { account } from '@/lib/appwrite/config';

import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';
import { useEffect } from 'react';
import { toast } from 'sonner';


const Home = () => {
    const { checkAuthUser } = useUserContext();
    //if user email not verified, show the warning
    useEffect(() => {

      (async () => {
        if(!await checkAuthUser()) return;
        const user = await account.get();
        if(!user.emailVerification){
          return toast.error('Please verify your email first before log in!',{
            description: 'Some features may not work as expected if your email is not verified.',
            duration: 20000,
            position: 'top-center',
            style: {
              background: 'linear-gradient(to right, #ff0000, #ff7f00)',
              color: '#fff',
              fontWeight: 'bold',
            },
          });
        }
      })();
    },[]);

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