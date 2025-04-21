import { IComment, INewPost, IReply, IUpdatePost, SignupUser } from '../../components/shared/types';
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
        //create the user in auth system failed
        if(!newAccount){
            throw new Error('Error creating account in auth system');
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
      if(//no user logged in
          localStorage.getItem('cookieFallback') === '[]' ||
          localStorage.getItem('cookieFallback') === null
      ){
          return null
      }else{
        //Appwrite SDK get current user from Auth system
        const user = await account.get();
        // console.log('auth user =>',user);
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
        // console.log('currentUser =>',currentUser);
        return currentUser.documents[0];
      }
    }catch(error){
        console.log('Error getting current user:', error);
    }
    
}

//sign out
export async function signOutAccount(){
    try{
        await account.deleteSession('current');
        return true;
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
      const fileUrl = storage.getFileView(
        appwriteConfig.storageId,
        fileId,
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
                likes: likesArray
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
//get created post details
export const getPostById = async (postId:string) => {
  try{
    const post = await databases.getDocument(
      appwriteConfig.databaseId, 
      appwriteConfig.postsCollectionId, postId
    );

    return post;
  }catch(error){
    console.log('Error getting post by id:', error);
  }
}
//edit a post
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file?.length > 0;
 
  try {
    let image = {
        imageUrl: post.imageUrl,
        imageId: post.imageId,
      };

    if (hasFileToUpdate) {
       // Upload file to Appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error ("File upload to storage failed");
       // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
   
   
    // Convert tags into an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
//delete the post
export async function deletePost(postId: string, imageId: string) {
  if(!imageId || !postId) throw Error;
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );
    await deleteFile(imageId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
//paginating posts
export async function getInfinitePosts({ pageParam }:{ pageParam: number }) {
  //pageParam is the "cursor" or "pointer" that tells queryFn where to continue fetching from.
  const queries : any[] = [Query.orderDesc("$createdAt"),Query.limit(20)];
  if(pageParam){
    console.log('cursor =>',Query.cursorAfter(pageParam.toString()))
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );
    if (!posts) throw Error ("Error getting recent posts");
    return posts;
  } catch (error) {
    console.log(error);
  }
}
//search posts
export async function searchPosts(searchTerm: string) {
  try{
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw Error ("Error getting recent posts");
    console.log('searchPosts =>',posts);
    return posts;  
  }catch(error){
    console.log(error);
  }
}
//create a comment
export async function createComment(comment: IComment) {
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      comment
    );
    return response;
  } catch (error) {
    console.log('createComment failed.',error);
  }
}
//paginating comments
export async function getInfiniteComments({ postId,pageParam }:{ postId:string,pageParam: number }) {
  const queries : any[] = [Query.orderDesc("$createdAt"),Query.equal("post", postId),Query.limit(5)];
  // console.log('pageParam =>',pageParam)
  if(pageParam){
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      queries
    );
    if (!comments) throw Error ("Error getting recent comments");
    return comments;
  } catch (error) {
    console.log(error);
  }
}
//write a reply to comment
export async function writeReplyToComment(reply: IReply) {
  // console.log('replay =>',reply);
  try {
    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      ID.unique(),
      reply
    );
    return response;
  } catch (error) {
    console.log('writeReplyToComment failed.',error);
  }
}
//get replies
export async function getInfiniteReplies({ commentId,pageParam }:{ commentId:string,pageParam: string }) {
  const queries : any[] = [Query.orderDesc("$createdAt"),Query.equal("comment_id", commentId),Query.limit(5),Query.orderDesc("$createdAt"),Query.limit(3)];
  // console.log('pageParam =>',pageParam)
  if(pageParam){
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const replies = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      queries
    );
    if (!replies) throw Error ("Error getting recent replies");
    return replies;
  } catch (error) {
    console.log(error);
  }
}