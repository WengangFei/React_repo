import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { createUserAccount, signInAccount, signOutAccount } from '../appwrite/api';
import { SignupUser } from '@/components/shared/types';


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

