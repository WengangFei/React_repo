const PostsThumbnail = ({ post }) => {
  return (
    <div className='m-6 w-10 h-10 border border-gray-400 rounded-lg md:w-20 md:h-20'>
        <img src={post.imageUrl} alt="post_image" className='w-full h-full object-cover rounded-lg'/>
        <p className='text-[8px]'>{ post.tags }</p>
    </div>
  )
}

export default PostsThumbnail