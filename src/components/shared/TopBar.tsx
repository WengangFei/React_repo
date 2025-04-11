import { Link } from 'react-router-dom';
import { TbSocial } from "react-icons/tb";
import { Button } from '../ui/button';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect, useState } from 'react';
import { useUserContext } from '@/context/AuthContext';
import { IoIosLogIn } from 'react-icons/io';
import { set } from 'zod';
import { toast } from 'sonner';

const TopBar = () => {

    const { mutateAsync: signOut, isSuccess } = useSignOutAccount();
    const { checkAuthUser } = useUserContext();
    const [userLogin,setUserLogin] = useState(false);
    //redirect to login page
    useEffect(()=>{
        (async () =>{
            console.log(await checkAuthUser());
            if(await checkAuthUser()){
               setUserLogin(true);
            }
        })();
    },[]);

    //handle sign out
    const handleSignOut = async () => {
        const confirmed = window.confirm("Are you sure you want to sign out?");
        if (confirmed) {
            try{
                const isSignOut = await signOut();
                if(isSignOut){
                    setUserLogin(false);
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
    //user id
    const { user } = useUserContext();

  return (
    <section className='topbar'>
        <div className='flex-between py-4 px-5'>
            <Link to='/' className='flex gap-3 items-center'>
                <TbSocial className="text-purple-700 size-5"/>
                <span className='text-purple-700 font-bold'>Inept coder</span>
            </Link>
            <div className='flex gap-2 items-center'>
                {
                    userLogin ? (
                        <>
                        <Button variant='ghost' className="mr-auto bottom-16" onClick=  {handleSignOut}>
                            <RiLogoutBoxRLine className='text-purple-700 scale-[1.5] ml-[-12px]' />
                            <span className=' font-bold text-xs'>Logout</span>
                        </Button>
                        <Link to={`/profile/${user?.id}`}>
                            <img src={user?.imageUrl || '/image.png'} alt="avatar" className='w-6 h-6 rounded-full ' />
                        </Link>
                        </>
                    ) : (
                         <div className='flex items-center text-xs'>
                            <IoIosLogIn className='text-purple-700 size-5 group-hover:text-white' />
                            <Link to='/sign-in' className='flex gap-3 items-center ml-2 '>
                                <span className='text-light-3 font-bold hover:bg-white hover:text-purple-500 rounded-md px-2 py-1'>Log In</span>
                            </Link>
                        </div>
                    )
                }
                
            </div>
        </div>
    </section>
  )
}

export default TopBar