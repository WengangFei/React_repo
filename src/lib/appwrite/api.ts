import { INewPost, SignupUser } from '../../components/shared/types';
import { account, appwriteConfig, avatars, databases, storage } from './config';
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
        const sessions = await account.listSessions();
        // console.log("Active sessions:", sessions);                  
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
        // console.log('currentUser =>',currentUser.documents[0]);
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
};
// create a post
export async function createPost(post: INewPost) {
    try {
      // Upload file to Appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error ("File upload to storage failed");
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into an array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        ID.unique(),
        {
          creator: post.user,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }
  //upload file to appwrite storage
  export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }

  //get file url
  export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        1000,
        1000,
        "center",
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }
  //delete a file
  export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }
  //get recent posts
  export const getRecentPosts = async () => {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        [Query.orderDesc("$createdAt"),Query.limit(20)]
      );
  
      if (!posts) throw Error ("Error getting recent posts");
  
      return posts.documents;
    } catch (error) {
      console.log(error);
    }
  }
  //add liked post to DB
  export const toggleLikePost = async (documentId: string, likesArray:string[]) => {
    try {
        // Update the document with the new likes array
        const response = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            documentId,
            {
                likes: likesArray, // Must be an array of user document IDs
            }
        );
        if (!response) {
            throw new Error("Error updating likes");
        }
        console.log('likes response =>',response);
        return response;
    } catch (error) {
        console.log("Error updating likes:", error);
    }
};
//save post
export const savePost = async (documentId: string, userId:string) => {
    try {
        // Update the document with the new likes array
        const response = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                post: documentId, // Must be an array of user document IDs
                user: userId,
            }
        );
    
        if (!response) {
            throw new Error("Error updating likes");
        }
        return response;
    } catch (error) {
        console.log("Error updating likes:", error);
    }
};

//delete saved post
export const deleteSavedPost = async (savedId:string) => {
    try {
        // Update the document with the new likes array
        const response = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedId,
        );
    
        if (!response) {
            throw new Error("Error updating likes");
        }
        return {
            status:"ok"
        };
    } catch (error) {
        console.log("Error updating likes:", error);
    }
};