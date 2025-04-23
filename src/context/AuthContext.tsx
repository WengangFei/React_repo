import { IContextType, IUser } from '@/components/shared/types';
import { getCurrentUser } from '@/lib/appwrite/api';
import { createContext, useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { set } from 'zod';

//initial user information
export const INITIAL_USER = {
    id:'',
    name:'',
    email:'',
    username:'',
    imageUrl:'',
    bio:'',
};
//initial state
const INITIAL_STATE = {
    user:INITIAL_USER,
    loginUser:{},
    isLoading:false,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false,
};
//create a context
const AuthContext = createContext<IContextType>(INITIAL_STATE);
const AuthProvider = ({ children }:{ children: React.ReactNode }) => {
    const [user,setUser] = useState<IUser>(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginUser, setLoginUser] = useState({});

    const checkAuthUser = async () => { 
        try{
            const currentAccount = await getCurrentUser();
            if(currentAccount){
                setUser({
                    id:currentAccount.$id,
                    name:currentAccount.name,
                    email:currentAccount.email,
                    username:currentAccount.username,
                    imageUrl:currentAccount.imageUrl,
                    bio:currentAccount.bio,
                });
                setLoginUser(currentAccount);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        }catch(error){
            console.log('checkAuthUser error =>',error);
        }finally {
            setIsLoading(false);
        }
    };

    //if user not authenticated
    //  useEffect(() => {
    //     if(
    //         localStorage.getItem('cookieFallback') === '[]' ||
    //         localStorage.getItem('cookieFallback') === null
    //     ) navigate('/sign-in');
    //     checkAuthUser();
    //  },[]);

    const value = { user,loginUser,isLoading,isAuthenticated,setUser,setIsAuthenticated,checkAuthUser }


  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);