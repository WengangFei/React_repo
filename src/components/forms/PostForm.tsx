
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





const PostForm = ({ post }: PostFormProps) => {
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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof postFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
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
                <FileUploader fieldChange={field.onChange} mediaUrl={ post?.imageUrl} />
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
            <Button type="submit" className="shad-button_primary whitespace-nowrap">Submit</Button>
        </div>
        
      </form>
    </Form>

  )


}
    
  


export default PostForm