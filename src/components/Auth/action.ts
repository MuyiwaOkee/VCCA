"use server"
import { CreateSession, DeleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import * as z from 'zod'
import { hash } from 'argon2';

type UserType = {
    email: string,
    password: string
}

type SignupType = {
    email?: string,
    password?: string,
    roleCombobox?: string,
    sectorCombobox?: string
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

const userRoleSchema = z.enum(['Business', 'Analyst (Internal)']);
const sectorSchema = z.enum(['Banking', 'Real estate']);

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

export const Logout = async () => {
    await DeleteSession();
    redirect('/login');
}

export type SignupOutput = {
    section: 'EmailPassword' | 'UserRole',
    errors: {
        email?: string[] | undefined;
        password?: string[] | undefined;
        roleCombobox?: string[] | undefined;
        sectorCombobox?: string[] | undefined;
    }
}

export const Signup = async ({ section }: SignupOutput, formData: FormData | undefined):Promise<SignupOutput> =>  {
    // if there is no form data, the user goes back to the start of the form
    if(!formData) {
        return {
                section: 'EmailPassword',
                errors: {
                    email: undefined,
                    password: undefined
                }
            };
    }
    
    const formDataObject = Object.fromEntries(formData) as SignupType;

    // find the section of the signup process there at, and then run the processes for that section
    switch (section) {
        case 'EmailPassword':
            const result = loginSchema.safeParse(formDataObject);

            if(!result.success) {
                return {
                    section: 'EmailPassword',
                    errors: result.error.flatten().fieldErrors
                };
            }

            return {
                section: 'UserRole',
                errors: {
                    email: undefined,
                    password: undefined
                }
            }

        case 'UserRole':
            // first, check if a role has sucessfully been chosen
            const result1 = userRoleSchema.safeParse(formDataObject.roleCombobox);

            if(!result1.success) {
                return {
                    section: 'UserRole',
                    errors: {
                        roleCombobox: ['Please select a valid role'],
                        sectorCombobox: undefined
                    }
                }
            }

            // if the chosen type was business, check for a valid sector
            if(formDataObject.roleCombobox === 'Business') {
                const result2 = sectorSchema.safeParse(formDataObject.sectorCombobox);

                if(!result2.success) {
                    return {
                        section: 'UserRole',
                        errors: {
                            roleCombobox: undefined,
                            sectorCombobox: ['Please select a valid sector']
                        }
                    }
                }
            }

            // Create the user account in the database and create session
            const { email, password: passwordNotHashed, roleCombobox: role, sectorCombobox:sector } = formDataObject;

            // this will be sent via post request to create a new user. it should return the user id, which will then be used to create a session before directing to the dashboard
            const newUser = {
                email,
                password: await hash(passwordNotHashed!), //hashed and salted password for added security
                role,
                sector
            };

            redirect('/dashboard');
    
        default:
             return {
                section: 'EmailPassword',
                errors: {
                    email: ['Unknown section'],
                    password: undefined
                }
            };
    }
}