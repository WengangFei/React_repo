
import { useGetAllUsers } from '@/lib/react-query/queriesAndMutations'
import React from 'react'
import { Link } from 'react-router-dom';

const People = () => {
  
  const { data:users } = useGetAllUsers();
  console.log('users =>',users)
  return (
    <div className='w-full flex flex-wrap flex-col p-6 gap-8 sm:flex-nowrap sm:flex-row '>
      {
        users && (
          users?.documents.map((user) => (
            <div key={user.$id} className='w-20 h-20 '>
              <Link to={`/profile/${user.$id}`}>
                <img src={user.imageUrl} alt="avatar" className='rounded-full w-full h-full'/>
              </Link>
              <p>{user.name}</p>
            </div>
          ))
        )
      }
    </div>
  )
}

export default People