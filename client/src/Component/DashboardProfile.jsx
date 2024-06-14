import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const DashboardProfile = () => {

  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null)
  const [imageFileurl, setImageFileurl] = useState(null)
  const [imageFileUploading, setImageFileUploading] = useState(null)
  const [imageFileUploadError, setImageFileUploadError] = useState(null)
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
  const filepickerRef = useRef(null);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(e.target.files[0]);
      setImageFileurl(URL.createObjectURL(file));
    }
  }

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile])

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          'Could not upload image (File must be less than 2MB)'
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileurl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileurl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  }


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-2 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' >
        <input type="file" accept='image/*' onChange={handleChangeImage} ref={filepickerRef} hidden />
        <div className="w-32 h-32 self-center overflow-hidden cursor-pointer shadow-md rounded-full" onClick={() => filepickerRef.current.click()}>
          <img src={imageFileurl || currentUser.profilePicture}
            alt="profile" className='rounded-full w-full object-cover border-8 border-[lightgray] ' />

        </div>
        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} />
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='Password' />
        <Button  >Submit</Button>
      </form>
      <div className='text-red-500 flex justify-between'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default DashboardProfile