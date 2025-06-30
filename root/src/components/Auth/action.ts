"use server"
import { CreateSession, DeleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import * as z from 'zod'

type LoginFormType = {
    email: string,
    password: string
}

type UserType = {
    id: string,
    email: string,
    role: string,
    sector?: string
}

type SignupType = {
    email?: string,
    password?: string,
    roleCombobox?: string,
    sectorCombobox?: string
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
    const formDataObject = Object.fromEntries(formData) as LoginFormType; //this transforms the form data into an object, with the names of the input as the keys, and the values as the values. then I have set the type

    // checks the user input against the schemea
   const result = loginSchema.safeParse(formDataObject);

    if(!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        };
    }

    // verify user credentials
    try {
        // send the auth/verify endpoint
        const response = await fetch(`http://localhost:8000/auth/verify`, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(result.data)
        });

        if(!response.ok) 
           switch (response.status) {
            case 400:
                    throw new Error("Missing account details");
                    break;

            case 401:
                 throw new Error("Email or password is incorrect");
                break;
           
            default:
                throw new Error("Problem with Server. Please try later");
                break;
           }
        

        // check response
        const data = (await response.json()) as UserType
        
        await CreateSession(data.id);
    } catch (error) {
        return {
            section: 'EmailPassword',
            errors: {
                email: [error],
                password: undefined
            }
        };
    }

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

            // check that the email doesn't already exist in the database
            try {
            const response = await fetch(`http://127.0.0.1:8000/auth/email/${result.data.email}`, {
                method: 'GET',
                headers: { 
                    "Content-Type": "application/json" 
                }
            });

            if(!response.ok) 
                switch (response.status) {
                    case 404 | 400 | 422:
                        throw new Error("No Email Provided");
                        break;
                
                    default:
                        throw new Error("Problem with server. Please try again later");
                        break;
                }

            // check response
            const data = (await response.json()) as boolean;

            console.log('The emai is in use? - ', data);

            if(data == true)
                throw new Error("Email is used by another user");
            
            // Go to next stage of the signup process
            return {
                section: 'UserRole',
                errors: {
                    email: undefined,
                    password: undefined
                }
            }

            } catch (error) {
                return {
                    section: 'EmailPassword',
                    errors: {
                        email: [error as string]
                    }
                };
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
            const { email, password, roleCombobox: role, sectorCombobox:sector } = formDataObject;

            // this will be sent via post request to create a new user. it should return the user id, which will then be used to create a session before directing to the dashboard
            const newUser = {
                email,
                password,
                role,
                sector
            };

            // try and add to database
            try {
                const response = await fetch(`http://localhost:8000/user/`, {
                    method: 'POST',
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify(newUser)
                });

                if(!response.ok) {
                    switch (response.status) {
                        case 409:
                            throw new Error("Emailed Already registered");
                            break;

                        case 422:
                            throw new Error("Missing account Data. Please check information");
                            break;

                        case 400:
                            throw new Error("Invalid account Data. Please check information");
                            break;
                    
                        default:
                            throw new Error("Problem with Server. Please try later");
                            break;
                    }
                }

            } catch (error) {
                return {
                    section: 'EmailPassword',
                    errors: {
                        email: [error as string],
                        password: undefined
                    }
                };
            }

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