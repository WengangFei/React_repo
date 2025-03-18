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
import { useState} from 'react'
import Loader from '@/components/shared/Loader'
import { Link } from 'react-router-dom';
import { createUserAccount } from '@/lib/appwrite/api'


const SignupForm = () => {
  

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
    
    setLoader(true);
    const newUser = await createUserAccount(values);
  }

  const [loader, setLoader] = useState(false);
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
            { loader ? <Loader content="Signing Up..."/> : "Sign Up" }
          </Button>
          <p className="text-xs">
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