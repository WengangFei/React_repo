import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "../ui/textarea"
import { useCreateComment, useGetComments } from "@/lib/react-query/queriesAndMutations"
import Loader from "./Loader"
import { toast } from "sonner"
import CommentsList from "./CommentsList"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"
import { useUserContext } from "@/context/AuthContext"
 

const CommentSection = ({ postId,userId }:{postId:string,userId:string}) => {
    const formSchema = z.object({
        comment: z.string().min(5, {
          message: "Username must be at least 5 characters.",
        }),
      })

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        comment: "",
        },
    })

    const { mutateAsync:createComment, isPending } = useCreateComment();
    const { isAuthenticated } = useUserContext();
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    //create comments for the post
    const response = await createComment({content:values.comment,post:postId,creator:userId});
    form.reset();
    if(!response) { 
        return toast.error('Comment creation failed, please try it again!',{
            duration: 5000,
            position: 'top-center',
            style: {
                background: 'linear-gradient(to right, #ff0000, #ff7f00)',
                color: '#fff',
                fontWeight: 'bold',
            }
        });
    }else{
        return toast.success('Comment created successfully!',{
            duration: 5000,
            position: 'top-center',
            style: {
                background: 'linear-gradient(to right, #4dff4d, #00cc00)',
                color: '#fff',
                fontWeight: 'bold',
            }
        });
    }
    
  }
  //fetching all comments for each post
  const { data:comments, fetchNextPage, hasNextPage } = useGetComments(postId);
  const { ref, inView } = useInView();
  //fetch more pages when scroll down
  useEffect(() => {
    fetchNextPage();
  },[inView]);
   
//   console.log('comments =>',postId,comments)

  return (
    <div>
        <h2 className="text-lg font-bold mb-5">{comments?.pages[0]?.total} Comments:</h2>
        
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Textarea placeholder="Add comment......" {...field} className='text-black'/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="button" variant="ghost" className='text-white ' onClick={()=>form.reset()} size='sm'>
                        <span className="text-xs ">Cancel</span>
                    </Button>
                    <Button type="submit" disabled={!form.formState.isValid} className='float-right' size='sm'>
                        {isPending ? <Loader content='Creating......'/> : <span className="text-xs ">Create</span>}
                    </Button>
                </form>
            </Form>
            
        
        
        {/* display all comments */}
        {
            comments && comments?.pages.map((comment,index)=> (<CommentsList key={`comment-${index}`} comment={comment} />))
        }
        
        {
            hasNextPage ? (
                    <div ref={ref} className='mt-10'>
                    <Loader content='Loading more comments......' />
                    </div>
                ):(
                    <div ref={ref} className='mt-10'>
                        <h1 className='text-light-4 text-center w-full'>No more comments!</h1>
                    </div>
                )
        }
        
    </div>
  )
}

export default CommentSection