import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, TextInput } from 'flowbite-react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import { updateStart, updateFailure, updateSuccess } from '../redux/userSlice/userSlice';
import { useDispatch } from 'react-redux';
import { set } from 'mongoose';

const DashboardProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileurl, setImageFileurl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const filepickerRef = useRef(null);
  const [formdata, setFormdata] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

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
          setFormdata({ ...formdata, profilePicture: downloadURL });
        });
      }

    );
  };

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    
    if (Object.keys(formdata).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/$(currentUser._id)`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata)
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess('Profile Updated Successfully');
      }
    }

    catch (error) {
      console.log(error)
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);

    }

  }


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-2 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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
            className={`rounded-full w-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'
              }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">
            {imageFileUploadError}
          </Alert>
        )}
        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type='password' id='password' placeholder='Password' onChange={handleChange} />
        <Button type='submit'>Submit</Button>
      </form>
      <div className='text-red-500 flex justify-between'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {
        updateUserSuccess && (
          <Alert color='success'>
            {updateUserSuccess}
          </Alert>
        )
      }
      {
        updateUserError && (
          <Alert color='failure' className='mt-5'>
            {updateUserError}
          </Alert>
        )
      }
    </div>
  );
};

export default DashboardProfile;
