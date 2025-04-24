

import PostsThumbnail from '@/components/shared/PostsThumbnail';
import { Models } from 'appwrite'
import React from 'react'
import { Link } from 'react-router-dom';

const MyAllPosts = ({ posts }: { posts: Models.Document[]}) => {
 
  return (
    <div className='  flex flex-row'>
        My Posts:
        {
            posts?.reverse()?.map((post:Models.Document) => (
                <div key={post.$id}>
                    <PostsThumbnail key={post.$id} post={post} />
                </div>
               
                
            ))
        }
    </div>
  )
}

export default MyAllPosts