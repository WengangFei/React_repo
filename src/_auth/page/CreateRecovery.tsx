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
import { toast } from "sonner"
 
const formSchema = z.object({
  email: z.string().email(),
})

const CreateRecovery = () => {
     // 1. Define your form.
     const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {email: "" },
    })
    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
       
        try{
            await account.createRecovery(values.email,import.meta.env.VITE_APPWRITE_EMAIL_RECOVERY_URL);
            form.reset();
            toast.success('Recovery link sent to your email',{
                duration: 5000,
                position: 'top-center',
                style: {
                  background: 'linear-gradient(to right, #4dff4d, #00cc00)',
                  color: '#fff',
                  fontWeight: 'bold',   
                }
            });
        }catch(error){
            toast.error('Error sending recovery link, please try again!',{
                duration: 5000,
                position: 'top-center',
                style: {
                    background: 'linear-gradient(to right, #ff0000, #ff7f00)',
                    color: '#fff',
                    fontWeight: 'bold',   
                }
                }
            );
            console.log(error);
        }
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                <h1>Recovery your password:</h1>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                        <Input placeholder="enter your email" type='email' {...field} className='text-black'/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default CreateRecovery