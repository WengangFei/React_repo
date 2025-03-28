import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, createUserAccount, deleteSavedPost, getCurrentUser, getRecentPosts, savePost, signInAccount, signOutAccount, toggleLikePost } from '../appwrite/api';
import { INewPost, SignupUser } from '@/components/shared/types';
import { QUERY_KEYS } from './queryKeys';
import { get } from 'http';



// useQuery fetch function 

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: () => getCurrentUser(),
    })
}

//get recent posts
export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

///////////////////////////////////////////////////////////////////////////////////
// useMutation function here 
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: async (user:SignupUser) => await createUserAccount(user),
    });
};

// call useMutation(), it returns an object containing several properties, including:
// mutate: A function that triggers the mutation.
// mutateAsync: Similar to mutate, but returns a promise.
// isLoading: true while the mutation is in progress.
// isSuccess: true if the mutation was successful.
// isError: true if the mutation failed.
// error: Contains error details if the mutation fails.
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: async (user:{email:string,password:string}) => await signInAccount(user),
    });
};
//sign out
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
};

//create a post
export const useCreatePost = () => {
    //query posts that can show in home page
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        // Mark the query with the key GET_RECENT_POSTS as stale.
        // Refetch it automatically the next time it's accessed.
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
}



//save likes post to DB
export const useLikedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ documentId, likesArray }: { 
            documentId: string; 
            likesArray: string[]; 
        }) => toggleLikePost(documentId, likesArray),
        onSuccess: (_,{ documentId }) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, documentId],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
}
//save likes post to DB
export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ documentId, userId }: { 
            documentId: string; 
            userId: string; 
        }) => savePost(documentId, userId),
        onSuccess: (_,{ documentId }) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, documentId],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
                });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
                });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
                });
        },
    });
}

//delete post to DB
export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (documentId:string) => deleteSavedPost(documentId),
        onSuccess: (documentId) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, documentId],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
                });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
                });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
                });
        },
    });
}

