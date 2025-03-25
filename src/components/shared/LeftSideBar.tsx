import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { TbSocial } from "react-icons/tb";
import { useUserContext } from '@/context/AuthContext';
import { Button } from '../ui/button';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames'; // import clsx or classnames
import { IoHomeOutline } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { BsFilePost } from "react-icons/bs";



const LeftSideBar = () => {

    //user id
    const { user } = useUserContext();
    //get current user information
    const { mutateAsync: signOut, isSuccess } = useSignOutAccount();
    //navigate
    const navigate = useNavigate();
    //handle sign out
    const handleSignOut = async () => {
        const confirmed = window.confirm("Are you sure you want to sign out?");
        if (confirmed) {
            signOut();
            console.log("User signed out");
        }
    }
    //redirect to login page
    useEffect(()=>{
        if(isSuccess){
            navigate(0);
        }
    },[isSuccess]);


    // check if link active
    const isActiveLink = ({ isActive }:{ isActive: boolean }) =>
        classNames('text-gray-500 ', {
        'font-bold bg-purple-500 text-white rounded-md px-6 py-1': isActive,
        'hover:text-purple-500 hover:bg-white font-bold rounded-md px-4 py-1': !isActive,
    })
    // const { pathname } = useLocation();
    // const isActiveLink = (currentPath: string, targetPath: string) => {
    //     return `${ currentPath === targetPath ? 'font-bold bg-purple-500 text-white rounded-md px-6 py-1' : 'text-gray-500 hover:text-blue-500 font-bold' }`;
    // }
    //change link icon color, create a custom hook
    const useIconActiveColor = ( target: string ) => {
        const { pathname } = useLocation();
        return classNames('text-purple-700 size-5 group-hover:text-white ',{
            'invert-white': pathname === target,
        });
    }
        
    
        
         

  return (

    <nav className='leftsidebar'>
        <div className='flex flex-col gap-11'>
            <Link to='/' className='flex gap-3 items-center'>
                <TbSocial className="text-purple-700 size-8"/>
                <span className='text-purple-700 font-bold text-2xl'>Inept coder</span>
            </Link>
            <Link to={`/profile/${user?.id}`} className='flex gap-3 items-center'>
                <img src={user?.imageUrl || '/image.png'} alt="avatar" className='w-10 h-10 rounded-full ' />
                <div className='flex flex-col'>
                    <p className='font-bold text-large text-purple-700'>{user?.name}</p>
                    <p className='text-xs text-light-3'>@{user?.username}</p>
                </div>
            </Link>
            {/* links */}
            <div className='flex flex-col gap-5 text-sm'>
                <div className='flex gap-4 items-center group'>
                    <IoHomeOutline className={ useIconActiveColor('/') }/>
                    <NavLink to='/' 
                    // className={ () => isActiveLink(pathname, '/') }>
                    className={ isActiveLink }>
                        Home
                    </NavLink>
                </div>
                
                <div className='flex gap-4 items-center group'>
                    <MdOutlineTravelExplore className={ useIconActiveColor('/explore') }/>
                    <NavLink to='/explore' 
                    // className={ () =>isActiveLink(pathname, '/profile') }>
                    className={ isActiveLink }>
                        Explore
                    </NavLink>
                </div>
                <div className='flex gap-4 items-center group'>
                    <FaPeopleGroup className={ useIconActiveColor('/people') }/>
                    <NavLink to='/people' 
                    // className={ () =>isActiveLink(pathname, '/profile') }>
                    className={ isActiveLink }>
                        People
                    </NavLink>
                </div>
                <div className='flex gap-4 items-center group'>
                    <BsFilePost className={ useIconActiveColor('/create_post') }/>
                    <NavLink to='/create_post' 
                    // className={ () =>isActiveLink(pathname, '/profile') }>
                    className={ isActiveLink }>
                        Create Post
                    </NavLink>
                </div>
                <div className='flex gap-4 items-center group'>
                    <FaSave className={ useIconActiveColor('/saved') }/>
                    <NavLink to='/saved' 
                    // className={ () =>isActiveLink(pathname, '/profile') }>
                    className={ isActiveLink }>
                        Saved
                    </NavLink>
                </div>
            </div>
            <Button variant='ghost' className="mr-auto fixed bottom-16" onClick={handleSignOut}>
                <RiLogoutBoxRLine className='text-purple-700 scale-[1.5] ml-[-12px]' />
                <span className='ml-6 font-bold text-xs'>Logout</span>
            </Button>
        </div>
    </nav>
  )
}

export default LeftSideBar