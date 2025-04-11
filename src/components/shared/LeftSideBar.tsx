import { Link, NavLink, useLocation} from 'react-router-dom';
import { TbSocial } from "react-icons/tb";
import { useUserContext } from '@/context/AuthContext';
import { Button } from '../ui/button';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect, useState } from 'react';
import classNames from 'classnames'; // import clsx or classnames
import { IoHomeOutline } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { BsFilePost } from "react-icons/bs";
import { IoIosLogIn } from "react-icons/io";
import { toast } from 'sonner';





const LeftSideBar = () => {

    //user id
    const { user, checkAuthUser } = useUserContext();
    const [login,setLogin] = useState(false);
    //get current user information
    const { mutateAsync: signOut, isPending } = useSignOutAccount();

    //handle sign out
    const handleSignOut = async () => {
        const confirmed = window.confirm("Are you sure you want to sign out?");
        if (confirmed) {
            try{
                const isSignOut = await signOut();
                if(isSignOut){
                    setLogin(false);
                    toast.success('Signed out successfully.',{
                        duration: 2000,
                        position: 'top-center',
                        style: {
                            background: 'linear-gradient(to right, #4dff4d, #00cc00)',
                            color: '#fff',
                            fontWeight: 'bold',
                        },
                    });
                    //there is a bug here that need to refresh the page, otherwise click login button will not direct user to sign in page.
                    setTimeout(() => {
                        window.location.reload();
                    },2000);
                    
                }
            }catch(error){
                console.log('Error signing out:', error);
            }
        }
    }
    //redirect to login page
    useEffect(()=>{
        (async () => {
            if(await checkAuthUser()){
                setLogin(true);
            }
        })();
    },[]);


    // check if link active
    const isActiveLink = ({ isActive }:{ isActive: boolean }) =>
        classNames('text-gray-500 ', {
            'font-bold bg-purple-500 text-white rounded-md px-6 py-1': isActive ,
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
    //can not call hook in conditionally logic, move them out
    const exploreIconColor = useIconActiveColor('/explore');
    const peopleIconColor = useIconActiveColor('/people');
    const createPostIconColor = useIconActiveColor('/create_post');
    const savedIconColor = useIconActiveColor('/saved');
        
            
         

  return (

    <nav className='leftsidebar'>
        <div className='flex flex-col gap-11'>
            {
                login && (
                    <>
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
                    </>
            
                )
            }
            {
                !login && (
                    <div className='flex items-center text-xs'>
                        <IoIosLogIn className={savedIconColor} />
                        <Link to='/sign-in' className='flex gap-3 items-center ml-2 '>
                            <span className='text-light-3 font-bold hover:bg-white hover:text-purple-500 rounded-md px-2 py-1'>Log In</span>
                        </Link>
                    </div>
                )
            }
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
                {/* only log in will be available */}
                {
                    login && (
                        <>
                          <div className='flex gap-4 items-center group'>
                            <MdOutlineTravelExplore className={exploreIconColor} />
                            <NavLink to='/explore' className={isActiveLink}>
                              Explore
                            </NavLink>
                          </div>
                          <div className='flex gap-4 items-center group'>
                            <FaPeopleGroup className={peopleIconColor} />
                            <NavLink to='/people' className={isActiveLink}>
                              People
                            </NavLink>
                          </div>
                          <div className='flex gap-4 items-center group'>
                            <BsFilePost className={createPostIconColor} />
                            <NavLink to='/create_post' className={isActiveLink}>
                              Create Post
                            </NavLink>
                          </div>
                          <div className='flex gap-4 items-center group'>
                            <FaSave className={savedIconColor} />
                            <NavLink to='/saved' className={isActiveLink}>
                              Saved
                            </NavLink>
                          </div>
                        </>
                )}
                
               
            </div>
            {
                login && (
                    <>
                        <Button variant='ghost' className="mr-auto bottom-16" onClick=  {handleSignOut}>
                            <RiLogoutBoxRLine className='text-purple-700 scale-[1.5] ml-[-12px]' />
                            <span className='ml-6 font-bold text-xs'>Logout</span>
                        </Button>
                    </>
                )
            }
            
        </div>
    </nav>
  )
}

export default LeftSideBar