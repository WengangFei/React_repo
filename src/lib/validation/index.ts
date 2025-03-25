//validation schema
import { z } from "zod"

//signup page schema
export const SignUpValidation = z.object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email(),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmpassword: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  }).refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  })

//signin page schema
  export const SignInValidation = z.object({
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  //post form schema
  export const postFormSchema = z.object({
    caption: z.string().min(5,{
      message: "Caption must be at least 5 characters.",
    }). max(2000),
    file: z.custom<File[]>(),
    location: z.string().min(2,{
      message: "Location must be at least 2 characters.",
    }).max(100),
    tags: z.string(),
  });