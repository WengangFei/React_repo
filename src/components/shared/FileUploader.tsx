import { useCallback, useState  } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { IoImagesOutline } from "react-icons/io5";
import { Button } from '../ui/button';
// import { FileUploaderProps } from './types';


const FileUploader = ({ onChange, mediaUrl }:{onChange:(FILES:File[]) => void, mediaUrl: string}) => {

    const [fileUrl, setFileUrl] = useState('');
    
    // The function onDrop is triggered when files are dropped or selected, and it receives an array of acceptedFiles.
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
     //define how to handle the drop or drag over file
        //create a temporary image url to display
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        // send the file object to the parent component;
        onChange(acceptedFiles);
    },[onChange]);
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
    // These props enable the drag-and-drop behavior
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer p-2'>
        {/* it is invisible by default, but allows users to select files via the file dialog when clicked (as an alternative to drag-and-drop). */}
        <input {...getInputProps()} className='cursor-pointer'/>
        {
            fileUrl ? (
                <>
                    <div className='flex flex-1 justify-center w-full lg:p-10 '>
                        <img 
                            className='rounded-xl'
                            src={fileUrl} alt="Preview" 
                        />
                    
                    </div>
                    <p className='file_uploader-label'>Click or drag a image to replace.</p>
                </>
                
            ):(
                <div className='file_uploader-box '>
                    { mediaUrl ? <img src={mediaUrl} alt="Preview" className='rounded-xl h-40'/> : <IoImagesOutline size={150}/> }
                    <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
                    <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>
                    <Button className='shad-button_dark_4'>Select From Computer</Button>
                </div> 
            )
        }
    </div>
  )
}

export default FileUploader