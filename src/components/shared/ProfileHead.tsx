import { formatDate } from '@/lib/utils';
import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone';
import { IoImagesOutline } from 'react-icons/io5';
import { Button } from '../ui/button';
import { getFilePreview, uploadFile } from '@/lib/appwrite/api';
import { toast } from 'sonner';
import { appwriteConfig, databases, storage } from '@/lib/appwrite/config';
import Loader from './Loader';

const ProfileHead = ({ user }) => {
    
    const [loading, setLoading] = useState(false);
    // console.log('user =>',user);

    //change profile image
    const [fileUrl, setFileUrl] = useState('');
    const [imgUrl, setImgUrl] = useState({} as File);
    // The function onDrop is triggered when files are dropped or selected, and it receives an array of acceptedFiles.
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        //define how to handle the drop or drag over file
        //create a temporary image url to display
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        // send the file object to the parent component;
        setImgUrl(acceptedFiles[0]);
    },[]);
    //use dropzone，manages the drag-and-drop functionality for file uploads
    const { getRootProps, getInputProps } = useDropzone({ 
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/svg+xml': ['.svg']
        }
    });
    




  return (
    <div>
        <div className='p-6'>
        {/* These props enable the drag-and-drop behavior */}
            <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer p-8 w-40 h-40 mb-6'>
                {/* it is invisible by default, but allows users to select files via the file dialog when clicked (as an alternative to drag-and-drop). */}
                <input {...getInputProps()} className='cursor-pointer'/>
                {
                    fileUrl ? (
                        <>
                            <div className='flex flex-1 justify-center w-full rounded-xl '>
                                <img 
                                    className='rounded-xl'
                                    src={fileUrl} alt="Preview" 
                                />
                            
                            </div>
                            <p className='text-[8px] mt-2 text-light-4'>click or drag a image to replace.</p>
                            <button className='text-[8px] mt-1 bg-light-4 rounded-lg px-2'
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    const response = await uploadFile(imgUrl);
                                    if(response){
                                        setLoading(true);
                                        toast.success('Image uploaded successfully!',{
                                            position: 'top-center',
                                            duration: 4000,
                                            style: {
                                                background: 'linear-gradient(to right, #4dff4d, #00cc00)',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                            }
                                        });
                                        //update avatar
                                        await databases.updateDocument(
                                            appwriteConfig.databaseId,
                                            appwriteConfig.usersCollectionId,
                                            user.$id,
                                            {
                                                avatarFileId: response.$id,
                                                imageUrl: getFilePreview(response.$id)
                                            }
                                        )
                                        //delete previous avatar in storage
                                        if(user.avatarFileId){
                                            await storage.deleteFile(
                                                appwriteConfig.storageId, 
                                                user.avatarFileId
                                            );
                                        }else{
                                            console.log('previous avatar image delete failed!');
                                        }
                                        setLoading(false);
                                    }else{
                                        toast.error('Error uploading image, please try again!',{
                                            position: 'top-center',
                                            duration: 4000,
                                            style: {
                                                background: 'linear-gradient(to right, #ff0000, #ff7f00)',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                            }
                                        });
                                    }
                                }}
                            >
                                { !loading ? 'Update' : <Loader content='Updating...'/> }
                            </button>
                        </>
                        
                    ):(
                        <div className='file_uploader-box mt-4 '>
                            { user.imageUrl ? <img src={user.imageUrl} alt="Preview" className='rounded-xl h-20'/> : <IoImagesOutline size={50}/> }
                            <h3 className='text-[8px] text-light-2 my-1 '>Drag photo here</h3>
                            <p className='text-light-4 text-[8px] my-1'>SVG, PNG, JPG</p>
                            <Button className='text-[8px] text-light-4 w-24 h-4 hover:text-light-1'>Select From Computer</Button>
                        </div> 
                    )
                }
            </div>
            
            <div className='flex flex-col'>
                <p className='subtle-semibold lg:small-regular'>{ user.username || 'Username' }</p> 
                <p className='subtle-semibold lg:small-regular'>{ user.email || 'Email' }</p>
                <p className='subtle-semibold lg:small-regular'>Member Since<br /> { formatDate(user.$createdAt) || 'Member Since' }</p>
                
            </div>
        </div>
           
    </div>
  )
}

export default ProfileHead