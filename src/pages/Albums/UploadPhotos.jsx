import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export const UploadPhotos = ({ albumId, onSubmit }) => {

    const inputFileRef = useRef();
    const inputDescriptionRef = useRef();

    const [photoSelected, setPhotoSelected] = useState(false);
    const [errors, setErrors] = useState({
      photo: '',
      description: '',
    });

    const handleInputChange = useCallback(() => {
      setPhotoSelected(inputFileRef.current.files.length > 0);
    }, []);

    const handleUpload = useCallback(async () => {

      if(!inputFileRef.current?.files?.length) {
        setErrors({
          photo: 'Photo is required',
          description: '',
        });
        return;
      }

      if(!inputDescriptionRef.current.value) {
        setErrors({
          photo: '',
          description: 'Description is required',
        });
        return;
      }
      
      const formData = new FormData();
      Array.from(inputFileRef.current.files).forEach((file) => {
        formData.append('photos', file);
      });
      formData.append('description', inputDescriptionRef.current.value);

      await onSubmit({
        albumId,
        formData
      });

      inputFileRef.current.value = null;
    }, [onSubmit, albumId]);

    useEffect(() => {
      inputFileRef.current.value = null;
    }, []);
 
  return (
    <div className='pt-4'>

        <Input ref={inputFileRef} type='file' multiple onChange={handleInputChange} accept="image/*" className="mb-2 w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 mt-4" validationError={errors.photo} />
        <Input ref={inputDescriptionRef} label='Album Description' validationError={errors.description} />

        <Button title="Start upload" variations='light' disabled={!photoSelected} onclick={handleUpload} />
    </div>
  );
}
