import React, { useRef, useState, useEffect } from 'react';
import {NavLink} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Button, TextInput, Modal } from 'flowbite-react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase';
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import { updateStart, updateFailure, updateSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess } from '../redux/userSlice/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


const DashboardProfile = () => {
  const dispatch = useDispatch();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileurl, setImageFileurl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const filepickerRef = useRef(null);
  const [formdata, setFormdata] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);

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

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/$(currentUser._id)`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }

  }
  const handlesignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: 'POST',
      })
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
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
        <Button type='submit' outline disabled={loading || imageFileUploading}>{loading ? 'Loading...' : 'Update'}</Button>
        {
          currentUser.isAdmin && (
            <NavLink to='/create-post' >
              <Button color='gray' type='button' className='w-full' >Create a Post</Button>
            </NavLink>
          )
        }
      </form>
      <div className='text-red-500 flex justify-between'>
        <span className='cursor-pointer' onClick={() => setShowModel(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handlesignout}>Sign Out</span>
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
      {
        error && (
          <Alert color='failure' className='mt-5'>
            {error}
          </Alert>
        )
      }
      <Modal show={showModel} onClose={() => setShowModel(false)} popup size='md' >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200mb -4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModel(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardProfile;
