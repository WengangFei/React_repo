import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import SearchResults from '@/components/shared/SearchResults';
import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/useDebounce';
import { useGetPosts, useSearchPosts } from '@/lib/react-query/queriesAndMutations';
import React, { useState , useEffect } from 'react';
import { FaSearch } from "react-icons/fa";
import { IoMdOptions } from "react-icons/io";
import { useInView } from 'react-intersection-observer';

const Explore = () => {

  const [searchValue , setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue, 1000);
  const { data:posts,fetchNextPage,hasNextPage } = useGetPosts();
  const { data:searchedPosts, isFetching:isSearchFetching } = useSearchPosts(debouncedValue);
console.log('searchedPosts =>',posts)
  //use inview
  const { ref, inView } = useInView();
  useEffect(() => {
    if(inView && !searchValue){
      fetchNextPage();
    }
  },[inView,searchValue]);
  if(!posts){
    return (
      <div className='flex-center w-full h-full'>
        <Loader content='Loading posts......'/>
      </div>
    )
  }

  const shouldShowSearchResults = searchValue !== '';
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every(item => item.documents.length === 0);




  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Search Posts</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4 items-center'>
          <FaSearch />
          <Input type='text' placeholder='search caption' className='explore-search' value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
        </div>
      </div>
      <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
        <h3 className='body-bold md:h3-bold'>New Posts</h3>
        <div className='flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer'>
          <p className='small-medium md:base-medium text-light-2'>See All</p>
          <IoMdOptions />
        </div>
      </div>
      <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
        {
          shouldShowSearchResults ? (<SearchResults isFetching={isSearchFetching} posts={searchedPosts}/>) : shouldShowPosts ? 
          (
            <p className='text-light-4 mt-10 text-center w-full'>End of posts</p>
          ) :
          posts.pages.map((item,index) => (
            <GridPostList key={`page-${index}`} posts={item.documents}/>
          ))
        }
      </div>
      {
        hasNextPage && !searchValue && (
          <div ref={ref} className='mt-10'>
           <Loader content='Loading more posts......' />
          </div>
        )}
    </div>
  )
}

export default Explore