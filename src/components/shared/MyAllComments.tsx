import { formatDate } from '@/lib/utils'
import { Models } from 'appwrite'
import React from 'react'
import { Link } from 'react-router-dom'

const MyAllComments = ({ comments }: { comments: Models.Document[]}) => {
  return (
    <div className='mt-6'>
        My All Comments:
        {
            comments?.reverse()?.map((comment:Models.Document) => (
                <div key={comment.$id} className='text-sm lg:base-medium p-2 '>
                    <Link to={`/post/${comment.post.$id}`}>
                        <div className='bg-slate-800 p-2 rounded-lg w-full hover:bg-light-3'>
                            
                                {
                                comment.content.length > 100 ? (
                                    <>
                                        {comment.content.slice(0, 100)}
                                        <span className='text-[12px] text-light-4'> 
                                            ......read more
                                        </span>
                                    </>
                                ) : 
                                    comment.content
                                }
                                <span className='float-right text-[10px] text-light-4 '>
                                    Created At:{formatDate(comment.$createdAt)}
                                </span>  
                            
                        </div> 
                    </Link>  
                </div>
            ))
        }
    </div>
  )
}

export default MyAllComments