import { Models } from 'appwrite'
import PostCard from './PostCard'

const GridPostList = ({ posts, showUser=true,showStats=true}:{ posts:Models.Document[],showStats?:boolean,showUser?:boolean}) => {

  return (
    <ul>
      {
        posts?.map((post:Models.Document) => (
          <li key={post.$id} className='relative min-w-50 h-50 m-8'>
            <PostCard post={post} />
          </li>
     
        ))
      }
    </ul>
  )
}

export default GridPostList