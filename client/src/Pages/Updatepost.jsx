import React, { useState } from 'react'
import { TextInput, Select, FileInput, Button, Alert } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom'
const Updatepost = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    console.log(formData)
    const handleUploadimage = async () => {
        try {
            if (!file) {
                setImageUploadError('Please select an image');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError('Image upload failed');
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
            console.log(error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/post/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message)
            }
           
            if (res.ok) {
                setPublishError(null)
                navigate(`/post/${data.slug}`)

            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput type='text' placeholder='Title' required id='title' className='flex-1' onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option >Select a category</option>
                        <option value='startupstories'>Startup Stories </option>
                        <option value='technoilogies'>New Technologies</option>
                        <option value='reaserach'>New Research</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500  p-3'>
                    <FileInput type='file' accept='images/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button type='button' size='sm' outline onClick={handleUploadimage} disabled={imageUploadProgress}>
                        {imageUploadProgress ? (
                            <div className='w-16 h-16'>
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0}%`}
                                />
                            </div>
                        ) : (
                            'Upload Image'
                        )}

                    </Button>

                </div>
                {
                    imageUploadError && <p className='text-red-500'>{imageUploadError}</p>
                }
                {
                    formData.image && <img src={formData.image} alt='upload' className='w-full h-72 object-cover' />
                }
                <ReactQuill theme="snow" placeholder='Write something...' className='h-72 mb-12' required onChange={(value) => { setFormData({ ...formData, content: value }) }} />
                <Button type='submit'>Publish</Button>
                {
                    publishError && <Alert color='failure' className='text-red-500'>{publishError}</Alert>
                }
            </form>

        </div>
    )
}

export default Updatepost