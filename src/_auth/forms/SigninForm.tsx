import { Button } from '@/components/ui/button'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInValidation } from '@/lib/validation'
import { TbSocial } from "react-icons/tb";
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom';
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { toast } from 'sonner'
import { useUserContext } from '@/context/AuthContext'



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
    async function onSubmit(values: z.infer<typeof SignInValidation>) {
      console.log(values);
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
          <p className="text-xs text-center">
            Don't have an account? 
            <Link to="/sign-up" className="text-purple-700 font-bold ml-2 cursor-pointer underline text-xs">
              Sign Up here
            </Link>
          </p>
        </form>
      </Form>
    </div>
    
  )
}

export default SigninForm