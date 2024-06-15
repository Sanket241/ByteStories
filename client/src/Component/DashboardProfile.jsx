import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, TextInput } from 'flowbite-react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar } from 'react-circular-progressbar';

const DashboardProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileurl, setImageFileurl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const filepickerRef = useRef(null);

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileurl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

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
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileurl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileurl(downloadURL);
          setImageFileUploading(false);
        });
      }
    );
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-2 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" accept='image/*' onChange={handleChangeImage} ref={filepickerRef} hidden />
        <div
          className="relative w-32 h-32 self-center overflow-hidden cursor-pointer shadow-md rounded-full"
          onClick={() => filepickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                },
                path: {
                  stroke: '#4F46E5',
                },
              }}
            />
          )}
          <img
            src={imageFileurl || currentUser.profilePicture}
            alt="profile"
            className={`rounded-full w-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">
            {imageFileUploadError}
          </Alert>
        )}
        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} />
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} />
        <TextInput type='password' id='password' placeholder='Password' />
        <Button>Submit</Button>
      </form>
      <div className='text-red-500 flex justify-between'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
};

export default DashboardProfile;
