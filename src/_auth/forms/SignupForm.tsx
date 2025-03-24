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
import { SignUpValidation } from '@/lib/validation'
import { TbSocial } from "react-icons/tb";
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { account } from '@/lib/appwrite/config'




const SignupForm = () => {
  
  const { mutateAsync: createUser, isPending:isCreatingUser } = useCreateUserAccount();
  //useMutation({
  //   mutationFn: (user:SignupUser) => createUserAccount(user),
  // });  => { mutate(), mutateAsync(), isLoading, isError, data, error }

  const { mutateAsync: signIn, isPending: isSigningIn } = useSignInAccount();

  // user context
  const { checkAuthUser, isLoading: isUserLoading, isAuthenticated } = useUserContext();

  // navigation
  const navigate = useNavigate();
  // 1. Define form instance
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name:"",
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    //appwrite api file function
    const newUser = await createUser(values);
    //if create user failed
    if(!newUser) {
      return toast.error('Account creation failed, please try it again!');
    }
    //user login to generates a session token
    const session = await signIn({
      email:values.email,
      password:values.password
    });
    console.log('session =>',session);
    if(!session) {
      return toast.error('Sign in failed,please try again!')
    }
    //is authenticated, send an email to user;s email
    if(isAuthenticated){
      account.createVerification(import.meta.env.VITE_APPWRITE_EMAIL_VERIFICATION_URL).then((response) => {
          console.log('Verification email sent to: ',response);
          }).catch((error) => {
          console.error('Error sending verification email:', error);
          })

      //check email verification
      account.get().then((user) => {
          console.log('User email is verified => ',user.emailVerification);
      })
    }

    //check if user is authenticated
    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn){
      form.reset();
      navigate('/');
    }
    else{
      return toast.error('Signup failed, please try again!');
    }

  }

  
  return (
    
    <div className="flex flex-center flex-col gap-6 border border-purple-500 rounded-[24px] p-8 md:p-14 min-w-80">

      <div className="flex flex-center flex-col gap-2">
          <div className="flex gap-2 items-center">
             <TbSocial className="text-purple-700 size-5"/>
             <span className='text-purple-700 font-bold'>Inept coder</span>
          </div>
         
          <h2>Create a new account</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col w-full">
          <FormField
            control={form.control}//field connect to form instance
            name="name"
            render={({ field,fieldState,formState }) => (
             
              <FormItem>
                {/* <FormLabel>Name</FormLabel> */}
                <FormControl>
                  <Input type='text' className="shad-input"
                  placeholder='Name'
                   {...field} />
                </FormControl>
                <FormMessage />{/* Automatically handles errors for this field */}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>User Name</FormLabel> */}
                <FormControl>
                  <Input type='text' className="shad-input"
                  placeholder='User Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="confirmpassword"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Confirm-Password</FormLabel> */}
                <FormControl>
                  <Input type='password' className="shad-input"
                  placeholder="confirm-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            { isCreatingUser ? <Loader content="Signing Up..."/> : "Sign Up" }
          </Button>
          <p className="text-xs text-center">
            Already have an account? 
            <Link to="/sign-in" className="text-purple-700 font-bold ml-2 cursor-pointer underline text-xs">
              Log in here
            </Link>
          </p>
        </form>
      </Form>
    </div>
  )
  
}

export default SignupForm