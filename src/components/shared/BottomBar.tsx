import { useLocation } from 'react-router-dom';
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { BsFilePost } from "react-icons/bs";
import { FaSave } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { useUserContext } from '@/context/AuthContext';
import { useEffect, useState } from 'react';


const BottomBar = () => {

    const useIconActiveColor = ( target: string ) => {
        const { pathname } = useLocation();
        return classNames('text-purple-700 size-5 group-hover:text-white ',{
            'invert-white': pathname === target,
        });
    }
    // check if link active
    const isActiveLink = ({ isActive }:{ isActive: boolean }) =>
        classNames('text-gray-500', {
        'font-bold bg-purple-500 text-white rounded-md px-2 py-1': isActive,
        'hover:text-purple-500 hover:bg-white font-bold rounded-md px-1 ml-1': !isActive,
    })    

    const { checkAuthUser } = useUserContext();
    const [userLogin,setUserLogin] = useState(false);
    //redirect to login page
    useEffect(()=>{
        (async () =>{
            if(await checkAuthUser()){
               setUserLogin(true);
            }
        })();
    },[]);

    //can not call hook in conditionally logic, move them out
    const exploreIconColor = useIconActiveColor('/explore');
    const peopleIconColor = useIconActiveColor('/people');
    const createPostIconColor = useIconActiveColor('/create_post');
    const savedIconColor = useIconActiveColor('/saved');
            
                
  return (
    <section className='bottom-bar'>
        {/* links */}
        <div className='flex gap-8 items-center justify-center w-full'>
            <NavLink to='/' 
            // className={ () => isActiveLink(pathname, '/') }>
            className={ isActiveLink }>
                <IoHomeOutline className={ useIconActiveColor('/') }/>
            </NavLink>
            {
                userLogin &&
                (<>
                    <div className='flex items-center group'>
                      <MdOutlineTravelExplore className={exploreIconColor} />
                      <NavLink to='/explore' className={isActiveLink}>
                        <span className='text-xs'>Explore</span>
                      </NavLink>
                    </div>
                    <div className='flex items-center group'>
                      <FaPeopleGroup className={peopleIconColor} />
                      <NavLink to='/people' className={isActiveLink}>
                        <span className='text-xs'>People</span>
                      </NavLink>
                    </div>
                    <div className='flex items-center group'>
                      <BsFilePost className={createPostIconColor} />
                      <NavLink to='/create_post' className={isActiveLink}>
                      <span className='text-xs'>Create Post</span>
                      </NavLink>
                    </div>
                    <div className='flex items-center group'>
                      <FaSave className={savedIconColor} />
                      <NavLink to='/saved' className={isActiveLink}>
                      <span className='text-xs'>Saved</span>
                      </NavLink>
                    </div>
                  </>)
            }     
        </div>
       
    </section>
  )
}

export default BottomBar