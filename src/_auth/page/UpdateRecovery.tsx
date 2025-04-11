import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { account } from "@/lib/appwrite/config"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { useState } from "react"
import Loader from "@/components/shared/Loader"
 
const formSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirm_password: z.string().min(8, {
    message: "Password are not match.",
  }),
}).refine(
    data => data.password === data.confirm_password,{
        message:'Passwords do not match.',
        path:["confirm_password"]
    }
)


const UpdateRecovery = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [flag,setFlag] = useState(false);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        password: "",
        confirm_password:""
        },
    })
    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        
        const userId = searchParams.get('userId');
        const secret = searchParams.get('secret');
        console.log(userId,secret)
        try{
            await account.updateRecovery(userId,secret,values.password);
            toast.success('Password updated successfully. Please log in now.',{
                duration: 5000,
                position: 'top-center',
                style: {
                  background: 'linear-gradient(to right, #4dff4d, #00cc00)',
                  color: '#fff',
                  fontWeight: 'bold',
                }
            });
            navigate('/sign-in');
        }catch(error){
            console.log('set new password failed:',error)
            toast.error('Error updating password, please try again!',{
                duration: 5000,
                position: 'top-center',
                style: {
                    background: 'linear-gradient(to right, #ff0000, #ff7f00)',
                    color: '#fff',
                    fontWeight: 'bold',
                }
            })
        }
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                <h1>Reset your password:</h1>
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password:</FormLabel>
                    <FormControl>
                        <Input placeholder="new password" type='password' {...field} className='text-black'/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>confirm_Password:</FormLabel>
                    <FormControl>
                        <Input placeholder="new password" type='password' {...field} className='text-black'/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">
                    {flag ? <Loader content="Updating......"/> : 'Reset'}
                </Button>
            </form>
        </Form>
    )
}

export default UpdateRecovery