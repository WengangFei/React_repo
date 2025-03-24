import { Link } from 'react-router-dom';
import { TbSocial } from "react-icons/tb";
import { Button } from '../ui/button';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';

const TopBar = () => {

    const { mutateAsync: signOut, isSuccess } = useSignOutAccount();
    const navigate = useNavigate();
    //redirect to login page
    useEffect(()=>{
        if(isSuccess){
            navigate(0);
        }
    },[isSuccess]);

    //handle sign out
    const handleSignOut = async () => {
        const confirmed = window.confirm("Are you sure you want to sign out?");
        if (confirmed) {
            signOut();
            console.log("User signed out");
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
                <Button variant='ghost' className="shad-button_ghost" onClick={handleSignOut}>
                    <RiLogoutBoxRLine className='text-purple-700 scale-[1.3]' />
                </Button>
                <Link to={`/profile/${user?.id}`}>
                    <img src={user?.imageUrl || '/image.png'} alt="avatar" className='w-6 h-6 rounded-full ' />
                </Link>
            </div>
        </div>
    </section>
  )
}

export default TopBar