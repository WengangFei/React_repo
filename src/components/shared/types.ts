import React from "react";
import { Models } from "appwrite";

export type LoaderProps = {
    content: string,
};

export type SignupUser = {
    name: string;
    username: string;
    email: string;
    password: string;   
    confirmpassword: string;
};

export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
  };

export type IContextType = {
    user: IUser;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
}

export type FileUploaderProps = {
    fieldChange:(FILES:File[]) => void;
    mediaUrl: string;
}

export type PostFormProps = {
    post?: Models.Document,
    actions?: 'create' | 'update'
}

export type INewPost = {
    user: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };

  export type IUpdatePost = {
    postId: string;
    caption: string;
    location?: string;
    tags?: string;
    file?: File[];
    imageUrl?: string;
    imageId?: string;
  }

  export type IComment = {
    content: string;
    post: string;
    creator: string;
  }

  export type IReply = {
    content: string;
    comment_id: string;
    writer_id: string;
  }