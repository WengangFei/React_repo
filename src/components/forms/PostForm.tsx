
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
import { postFormSchema } from "@/lib/validation"
import { Textarea } from "@/components/ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostFormProps } from "../shared/types"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import Loader from "../shared/Loader"





const PostForm = ({ post, actions }: PostFormProps) => {
    // 1. Define your form.
  const form = useForm<z.infer<typeof postFormSchema>>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      caption: post ? post?.caption: " ",
      file: [],
      location: post ? post?.location: " ",
      tags: post ? post.tags.join(","): "",
    },
  })

  //write post into db
  const { mutateAsync: createPost, isPending } = useCreatePost();
  //update post into db
  const { mutateAsync: updatePost, isPending: isUpdatePending } = useUpdatePost();
  //get user infor
  const { user } = useUserContext();

  //navigate instance
  const navigate = useNavigate();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof postFormSchema>) {
    //update post
    if(post && actions === 'update') {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl
      });
      if(!updatedPost) {
        return toast.error('Post update failed, please try it again!');
      }
      //redirect to home after post created successfully
      return navigate(`/post/${updatedPost.$id}`);
    }
    //create a post
    const newPost = await createPost({
      ...values,
      user: user.id,
    });
    if(!newPost) {
      return toast.error('Post creation failed, please try it again!');
    }
    //redirect to home after post created successfully
    navigate('/');
  }

  return (

    
    <Form {...form}>
        
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-10">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Textarea className='shad-textarea custom-scrollbar' {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add photos</FormLabel>
              <FormControl>
                <FileUploader {...field } mediaUrl={ post?.imageUrl } />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Location</FormLabel>
              <FormControl>
                <Input type="text" className='shad-input' {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add Tags(separated by comma ",")</FormLabel>
              <FormControl>
                <Input type="text" className='shad-input' placeholder="Art,Music,Learn,etc" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
            <Button type="button" className="shad-button_dark_4">Cancel</Button>
            <Button type="submit" className="shad-button_primary whitespace-nowrap" disabled={isPending || isUpdatePending}>
              {
                isPending || isUpdatePending ? (
                  <Loader content="Loading..."/>
                ) : (
                  actions === 'create' ? 'Post' : 'Update'
                )
              }
            </Button>
        </div>
        
      </form>
    </Form>

  )


}
    
  


export default PostForm