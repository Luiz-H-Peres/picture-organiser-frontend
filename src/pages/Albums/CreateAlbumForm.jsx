import { useState, useCallback, useEffect } from "react";
import { Message } from "../../components/Message";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

export const CreateAlbumForm = ({ isLoading, createAlbum }) => {

    const [errors, setErrors] = useState({
        albumName: '',
        albumDescription: '',
    });

    const formValidate = useCallback(() => {

        const albumName = document.getElementById('albumName').value;
        const albumDescription = document.getElementById('albumDescription').value;

        if(!albumName) {
            setErrors(errors => ({
                ...errors,
                albumName: 'Album name is required'
            }));
            return;
        }

        setErrors({
            albumName: '',
            albumDescription: '',
        }); 
        
        return {
            albumName,
            albumDescription,
        }
    }, []);

    const handleCreateAlbum = useCallback(async () => {

        const validated = formValidate();

        if(!validated) {
            return;
        }

        await createAlbum(validated);
        
        document.getElementById('albumName').value = '';
        document.getElementById('albumDescription').value = '';
      
    }, [createAlbum, formValidate]);

    // Reset form on successful submission
    useEffect(() => {
        document.getElementById('albumName').value = '';
        document.getElementById('albumDescription').value = '';      
    }, []);
 
  return (
    <div>
        { isLoading && <Message message="Creating..." variations="none" />}

        <Input id='albumName' label='Album Name' validationError={errors.albumName} />
        <Input id='albumDescription' label='Album Description' validationError={errors.albumDescription} />
        <Button title='Create' onclick={handleCreateAlbum} variations="success" />
    </div>
  );
}
