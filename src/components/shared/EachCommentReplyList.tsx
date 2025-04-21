import { useGetReplies } from '@/lib/react-query/queriesAndMutations';
import { timeAgo } from '@/lib/utils';

import { Link } from 'react-router-dom';
import Loader from './Loader';

const EachCommentReplyList = ({ replies, commentId }:{ replies:{ pages: { documents: any[]; }[]; pageParams: undefined | string[];}, commentId: string}) => {
    // console.log('replies =>',replies);
    const { fetchNextPage, hasNextPage, isFetchingNextPage, } = useGetReplies(commentId);


console.log()
  return (
    <div>
        { 
           replies?.pages?.map( item => (
                item?.documents?.map((item) =>(
                <div key={item.$id}>
                    <Link to={`/profile/${item?.writer_id?.$id}`} className='flex items-center gap-3'>
                        <img src={item?.writer_id?.imageUrl || 'image.png'} alt="avatar" className='w-5 h-5 rounded-full object-cover'/>
                        
                        <div className='flex flex-col'>
                            <p className='text-[10px] text-light-1'>{ item?.writer_id?.name || 'Creator Name'}</p>
                            <div className='flex-center gap-2 text-light-3'>
                                <p className='text-[10px]'>{ timeAgo(item!.$createdAt) || 'Created At'}</p>
                            </div>
                        </div>
                    </Link> 
                    <div className='small-medium lg:base-medium py-2'>
                        <p className='text-xs'>{ item.content }</p>
                        <hr className='my-2'/>
                    </div>
                </div>)
            )))
        }

        {   
            hasNextPage ? (
                <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="text-blue-500 hover:underline text-sm mt-2"
                >
                    {isFetchingNextPage ? <Loader content='Loading more replies......'/> : 'Load More Replies'}
                </button>
            ):(
                <p className='text-xs text-light-3'>No more replies</p>
            )
        }
    </div>
  )
}

export default EachCommentReplyList