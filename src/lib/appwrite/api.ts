import { SignupUser } from '../../components/shared/types';
import { account } from './config';
import { ID } from 'appwrite';
export async function  createUserAccount(user:SignupUser){
    console.log('create a new user =>',user);
    try{    
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )
        console.log('User created successfully:', newAccount);
        return newAccount;
    }catch(error){
        console.error('Error creating account:', error);
    }
}