import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { createComment, createPost, createUserAccount, deletePost, deleteSavedPost, getAllUsers, getCurrentUser, getInfiniteComments, getInfinitePosts, getInfiniteReplies, getPostById, getRecentPosts, savePost, searchPosts, signInAccount, signOutAccount, toggleLikePost, updatePost, writeReplyToComment } from '../appwrite/api';
import { IComment, INewPost, IReply, IUpdatePost, SignupUser } from '@/components/shared/types';
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
//get created posts
export const useGetPostById = (postId:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POSTS, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}

//search post
export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm 
    })
}
//get all users
export const useGetAllUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_USERS],
        queryFn: getAllUsers,
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
        mutationFn: signOutAccount
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

//delete saved post in DB
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
//update a post in DB
export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post:IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
            });
        },
    });
}
//delete a post in Db
export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post:{postId:string,imageId:string}) => deletePost(post.postId,post.imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
                });

        },
    });
}
//paginating post
export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        //determining how the next page of data should be fetched
        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage.documents.length === 0 ) return null;
            const lastId = lastPage?.documents[lastPage.documents.length - 1]?.$id;
            return lastId
        },
    })
}
//create comment
export const useCreateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (comment: IComment) => createComment(comment),
        // React Query passes the variables mutated with as the second argument to onSuccess
        onSuccess: (data,comment) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_COMMENTS, comment.post],
            });
            
        },
    });
}
//fetching comments for each post
export const useGetComments = (postId:string) =>{
    //{pages: Array(3), pageParams: Array(3)}
    // pageParams: (3) [undefined, '67fe5324003af693f96a', '67fe0e8d00187f9a1d95']
    // pages: (3) [{…}, {…}, {…}]
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_COMMENTS, postId],
        queryFn: ({ pageParam }:{ pageParam: number }) => getInfiniteComments({postId,pageParam}),
        getNextPageParam: (lastPage) => {
            // console.log('lastPage =>',lastPage)
            if (lastPage && lastPage.documents.length === 0) return null;
            const lastId = lastPage?.documents[lastPage.documents.length - 1]?.$id;
            return lastId;
        },
        enabled: !!postId,
    })
}
//write reply to comment
export const useWriteReply = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reply: IReply) => writeReplyToComment(reply),
        onSuccess: (_,reply) => {  
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_REPLIES,reply.comment_id],  
            })
        }
    })
}
//fetch replies
export const useGetReplies = (commentId:string) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_REPLIES, commentId],
        queryFn: ({ pageParam }:{ pageParam: number }) => getInfiniteReplies({commentId,pageParam}),
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.documents.length === 0) return null;
            const lastId = lastPage?.documents[lastPage.documents.length - 1]?.$id;
            return lastId;
        },
        enabled: !!commentId,
    })
}

