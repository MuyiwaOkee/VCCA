"use server"
import { CreateSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import * as z from 'zod'

type UserType = {
    email: string,
    password: string
}

const testUser:UserType = {
    email: "youshould@subscribe.com",
    password: '12345678'
}

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export const Login = async (_prevState: any, formData: FormData) => {
    const formDataObject = Object.fromEntries(formData) as UserType; //this transforms the form data into an object, with the names of the input as the keys, and the values as the values. then I have set the type

    // checks the user input against the schemea
   const result = loginSchema.safeParse(formDataObject);

    if(!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        };
    }

    // sends the user input against the actual user information
    if(formDataObject.email !== testUser.email || formDataObject.password !== testUser.password) {
        return {
            errors: {
                email: ["Email or password is wrong"],
                password: undefined
            }
        }
    }

    await CreateSession(formDataObject.email);

    // create session and redirect
    redirect('/dashboard');
}