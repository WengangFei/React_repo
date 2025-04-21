import { timeAgo } from "@/lib/utils"
import { Link } from "react-router-dom"
import { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form"
  import { useForm } from "react-hook-form"
  import { zodResolver } from "@hookform/resolvers/zod"
  import Loader from "./Loader"
import { z } from "zod";
import { useGetReplies, useWriteReply } from "@/lib/react-query/queriesAndMutations";
import { toast } from "sonner";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import EachCommentReplyList from "./EachCommentReplyList";
import { useUserContext } from "@/context/AuthContext";


const SingleComment = ({ item }) => {
//    console.log('item =>',item);
    const [reply, setReply] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
//get login user info
    const { user } = useUserContext();
    const formSchema = z.object({
        reply: z.string().min(3, {
            message: "Username must be at least 3 characters.",
        }),
    })

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        reply: "",
        },
    })
    //get replies
    const { data: replies } = useGetReplies(item.$id);
   
    const { mutateAsync:createReply, isPending } = useWriteReply();
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log('post =>',item);
        try{
            const response = await createReply({content:values.reply,writer_id:user.id,comment_id:item.$id});
            form.reset();
            setReply(false);
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
        }catch(error){
            console.log('Reply to comment failed.',error);
        }
    }

  return (
    <div key={item.$id}>    
        <Link to={`/profile/${item?.creator.$id}`} className='flex items-center gap-3'>
            <img src={item?.creator?.imageUrl || 'image.png'} alt="avatar" className='w-7 h-7 rounded-full object-cover'/>
            
            <div className='flex flex-col'>
                <p className='text-sm lg:body-bold text-light-1'>{ item?.creator.name || 'Creator Name'}</p>
                <div className='flex-center gap-2 text-light-3 text-xs lg:small-regular'>
                    <p className='subtle-semibold lg:small-regular'>{ timeAgo(item!.$createdAt) || 'Created At'}</p>
                </div>
            </div>
        </Link>  
        <div className="text-xs px-10 m-2">
            {item.content}
        <div className="flex float-right items-center">
             
            
            {
                replies?.pages[0]?.total !== 0 && (
                    <button className=" w-5 h-5 text-purple-600 font-bold hover:text-white" onClick={()=>setShowReplies(!showReplies)}>
                        { 
                            !showReplies ? <RiArrowDropUpLine className="w-5 h-5"/> :<RiArrowDropDownLine className="w-5 h-5"/> 
                        }
                    </button>
                )
            }
            { 
                replies?.pages[0]!.total > 0 && <span className="text-[10px] text-white font-bold mr-3">{replies?.pages[0]?.total}</span>
            }

            <button className=" w-4 h-4 text-[10px] text-purple-600 font-bold hover:text-white" 
            onClick={()=>setReply(true)}>
                Replay
            </button>
        </div>
        
        {
            reply && (
                <div className="mt-2">
                        <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="reply"
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <input placeholder={`@${item.creator.name}:`} {...field} className='text-white h-6 w-full  text-xs bg-transparent outline-none border-b-2' />
                                    
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <button type="button" className='text-white hover:text-red' onClick={()=>{
                                form.reset();
                                setReply(false)
                            }}>
                                <span className="text-xs ">Cancel</span>
                            </button>
                            <button type="submit" disabled={!form.formState.isValid} className={`float-right ${!form.formState.isValid ? 'text-gray-600' : 'hover:text-purple-700'}`} >
                                {isPending ? <Loader content='Creating......'/> : <span className="text-xs ">Create</span>}
                            </button>
                        </form>
                    </Form>
                </div>
            )
        }
        {
            showReplies && (
                <div className="mt-2">
                    <EachCommentReplyList replies={replies} commentId={item.$id}/>
                </div>
            )
        }
        </div>
        
        
        <hr className='mb-2 border-stone-700'/>
    </div>
  )
}

export default SingleComment