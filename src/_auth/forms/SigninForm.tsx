import { Button } from '@/components/ui/button'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInValidation } from '@/lib/validation'
import { TbSocial } from "react-icons/tb";
import Loader from '@/components/shared/Loader'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { toast } from 'sonner'
import { useUserContext } from '@/context/AuthContext'
import { account, appwriteConfig, avatars, databases } from '@/lib/appwrite/config'
import { Query } from 'appwrite'
import { saveUserToDB } from '@/lib/appwrite/api'
import { useEffect } from 'react'






const SigninForm = () => {

  // 1. Define form instance
    const form = useForm<z.infer<typeof SignInValidation>>({
      resolver: zodResolver(SignInValidation),
      defaultValues: {
        email: "",
        password: "",
      },
    })
  //handle sign in 
  const { mutateAsync: signIn, isSuccess } = useSignInAccount();
  //navigate
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    //create a session
    const session = await signIn(values);
    if(!session) {
      return toast.error('Sign in failed,please try again!');
    }
    //check is logged in
    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn){
      form.reset();
      navigate('/');
    }else{
      return toast.error('Sign in failed,please try again!');
    }
  }
  //google sign in
   const googleAuthSignin = async () => {
    try {
      // Start OAuth2 session (redirects to Google)
      await account.createOAuth2Session(
        'google',
        'http://localhost:5173/sign-in?google=1',//success redirect url
        'http://localhost:5173/failure'//falied redirect url, haven't set up yet
      );
  
      // After redirect, this part won't be reached immediately, so need another function
      // to run after user comes back
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };
  //run this function after google redirect
  const handleGoogleRedirect = async () => {
    try {
      const authUserCreated = await account.get();
      const ifUserCreatedInDb = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('accountId', authUserCreated.$id)]
      );
      //if no user created in db
      if (ifUserCreatedInDb.documents.length === 0) {
        const avatarUrl = avatars.getInitials(authUserCreated.name);
        await saveUserToDB({
          accountId: authUserCreated.$id,
          email: authUserCreated.email,
          name: authUserCreated.name,
          username: authUserCreated.name,
          imageUrl: avatarUrl,
        });
      }
      toast.success('Signing you in......',{
        duration:3000,
        position:'top-center',
        style: {
          background: 'linear-gradient(to right, #4dff4d, #00cc00)',
          color: '#fff',
          fontWeight: 'bold',
        }
      });
      //write session
      localStorage.setItem('cookieFallback', 'true');
      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error after Google redirect:', error);
    }
  };

  // Run only when coming back from Google
  useEffect(() => {
    
    const isFromGoogle = new URLSearchParams(location.search).get('google');
    if (isFromGoogle) {
      handleGoogleRedirect();
    }
  }, [location]);

  return (
    <div className="flex flex-center flex-col gap-6 border border-purple-500 rounded-[24px] p-8 md:p-14 min-w-80">

      <div className="flex flex-center flex-col gap-2">
          <div className="flex gap-2 items-center">
             <TbSocial className="text-purple-700 size-5"/>
             <span className='text-purple-700 font-bold'>Inept coder</span>
          </div>
         
          <h2>Log In Your Account</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Email</FormLabel> */}
                <FormControl>
                  <Input type='email' className="shad-input"
                  placeholder='Email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Password</FormLabel> */}
                <FormControl>
                  <Input type='password' className="shad-input" 
                  placeholder='Password'{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
            <Button type="submit" className="shad-button_primary">
              { isSuccess ? <Loader content="Signing In..."/> : "Sign In" }
            </Button>
            <Button type='button' onClick={googleAuthSignin}>
              <img src='/icons/google.webp' alt="google" className="w-6 h-6 mr-2"/> Login with google
            </Button>
       
          
          <div className="text-xs text-center">
            Don't have an account? <br />
            <Link to="/sign-up" className="text-purple-700 font-bold ml-2 cursor-pointer underline text-xs mr-2">
              Sign Up here
            </Link>
            or
            <Link to="/create_recovery" className="text-purple-700 font-bold cursor-pointer underline text-xs ml-2">
              Forget password?
            </Link>
          </div>
          
        </form>
      </Form>
    </div>
    
  )
}

export default SigninForm