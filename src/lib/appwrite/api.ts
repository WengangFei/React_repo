import { SignupUser } from '../../components/shared/types';
import { account, appwriteConfig, avatars, databases } from './config';
import { ID, Query } from 'appwrite';
export async function  createUserAccount(user:SignupUser){
    console.log('create a new user =>',user);
    try{
        //registered in Appwrite auth system   
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        )
        //create the user failed
        if(!newAccount){
            throw new Error('Error creating account');
        }
        // Generates initials-based avatar
        const avatarUrl = avatars.getInitials(user.name);
        // Output: "https://cloud.appwrite.io/v1/avatars/initials?name=John%20Doe"
        const newUser = await saveUserToDB({
            accountId:newAccount.$id,
            email: newAccount.email,
            name: newAccount.name,
            username:user.username,
            imageUrl:avatarUrl,
        });
        return newUser;
    }catch(error){
        console.error('Error creating account:', error);
    }
}
//save user to database
export async function saveUserToDB(user:{
    accountId:string,
    email:string,
    name:string,
    imageUrl:string,
    username?:string,
}){
    try{
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,//DB id
            appwriteConfig.usersCollectionId,//user table id
            ID.unique(),//user id
            user//user data
        )
        return newUser
    }catch(error){
        console.error('Error saving user to database:', error);
    }
};
//after sign up, Appwrite generates a session token for Authentication
export async function signInAccount(user:{email:string,password:string}){
    try{
        const session = await account.createEmailPasswordSession(user.email,user.password);
        console.log('session =>',session);
        return session;
    }catch(error){
        console.log('Error signing in:', error);
        return { session: null, error: 'Invalid credentials' };;
    }
};


export async function getCurrentUser(){
    try{
        //Appwrite SDK get current user from Auth system
        const user = await account.get();
        console.log('user =>',user);
        const sessions = await account.listSessions();
        console.log("Active sessions:", sessions);                  
        if(!user){
            throw new Error('Error getting current user');
        }
        //Appwrite SDK get current user from DB
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal('accountId',user.$id)]// filters the documents to only those where the field accountId equals the user's unique ID (user.$id).
        )
        if(!currentUser) throw new Error('Error getting current user');
        console.log('currentUser =>',currentUser.documents[0]);
        return currentUser.documents[0];
    }catch(error){
        console.log('Error getting current user:', error);
    }
}

//sign out
export async function signOutAccount(){
    try{
        const session = await account.deleteSession('current');
        return session;
    }catch(error){
        console.log('Error signing out:', error);
    }
}