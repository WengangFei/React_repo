import React from 'react'
import Loader from './Loader'
import { Models } from 'appwrite';
import GridPostList from './GridPostList';

const SearchResults = ({ isFetching, posts }:{ isFetching: boolean, posts:Models.Document[] }) => {

  if(isFetching) {
    return (
      <h1 className='flex-center w-full h-ful flex-1'><Loader content='Loading......'/></h1>
    )
  }
  if(posts && posts.documents.length > 0){
    return(
      <GridPostList posts={posts.documents} />
    )
  }
  return (
    <div>
   
    <h1 className='text-light-4 mt-10 text-center w-full'>No Results Found!</h1>
    </div>
  )
}

export default SearchResults