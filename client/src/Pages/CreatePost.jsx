import React, { useState } from 'react';
import { TextInput, Select, FileInput, Button, Alert } from 'flowbite-react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({ title: '', category: '', content: '', image: '' });
    const [publishError, setPublishError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    const handleUploadImage = async () => {
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
                        setFormData((prevData) => ({ ...prevData, image: downloadURL }));
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image upload failed');
            setImageUploadProgress(null);
            console.log(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.category) {
            setValidationError('Title, content, and category are required');
            return;
        }
        setValidationError(null);
        try {
            const res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
            } else {
                setPublishError(null);
                navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishError('Something went wrong');
        }
    };

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a Post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <Select
                        required
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value=''>Select a category</option>
                        <option value='startupstories'>Startup Stories</option>
                        <option value='technologies'>New Technologies</option>
                        <option value='research'>New Research</option>
                    </Select>
                </div>
                <div className='flex gap-4 items-center justify-between border-4 border-teal-500 p-3'>
                    <FileInput
                        type='file'
                        accept='image/*'
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button
                        type='button'
                        size='sm'
                        outline
                        onClick={handleUploadImage}
                        disabled={!!imageUploadProgress}
                    >
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
                {imageUploadError && <p className='text-red-500'>{imageUploadError}</p>}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <textarea
                    className='h-72 mb-12 p-3 border border-gray-300 rounded'
                    placeholder='Write something...'
                    required
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
                <Button type='submit'>Publish</Button>
                {publishError && (
                    <Alert color='failure' className='text-red-500'>
                        {publishError}
                    </Alert>
                )}
                {validationError && (
                    <Alert color='failure' className='text-red-500'>
                        {validationError}
                    </Alert>
                )}
            </form>
        </div>
    );
};

export default CreatePost;
