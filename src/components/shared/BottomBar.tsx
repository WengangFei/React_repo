import { useLocation, Link, useNavigate } from 'react-router-dom';
import { TbSocial } from "react-icons/tb";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaPeopleGroup } from "react-icons/fa6";
import { BsFilePost } from "react-icons/bs";
import { FaSave } from "react-icons/fa";
import { useUserContext } from '@/context/AuthContext';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { Button } from '../ui/button';
import { RiLogoutBoxRLine } from 'react-icons/ri';

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
        'font-bold bg-purple-500 text-white rounded-md px-6 py-1': isActive,
        'hover:text-purple-500 hover:bg-white font-bold rounded-md px-4 py-1': !isActive,
    })       
        
  return (
    <section className='bottom-bar'>
        {/* links */}
        <div className='flex gap-8 items-center justify-center w-full'>
            <NavLink to='/' 
            // className={ () => isActiveLink(pathname, '/') }>
            className={ isActiveLink }>
                <IoHomeOutline className={ useIconActiveColor('/') }/>
            </NavLink>

            <NavLink to='/explore' 
            // className={ () =>isActiveLink(pathname, '/profile') }>
            className={ isActiveLink }>
                <MdOutlineTravelExplore className={ useIconActiveColor('/explore') }/>
            </NavLink>
            <NavLink to='/people' 
            // className={ () =>isActiveLink(pathname, '/profile') }>
            className={ isActiveLink }>
                <FaPeopleGroup className={ useIconActiveColor('/people') }/>
            </NavLink>
                
            <NavLink to='/create_post' 
            // className={ () =>isActiveLink(pathname, '/profile') }>
            className={ isActiveLink }>
                    <BsFilePost className={ useIconActiveColor('/create_post') }/>
            </NavLink>

            <NavLink to='/saved' 
            // className={ () =>isActiveLink(pathname, '/profile') }>
            className={ isActiveLink }>
                <FaSave className={ useIconActiveColor('/saved') }/>
            </NavLink>
            
        </div>
       
    </section>
  )
}

export default BottomBar