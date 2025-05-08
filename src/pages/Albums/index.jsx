import { useState, useMemo, useRef, useCallback } from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { useAuth } from "../../hooks/useAuth";
import { useAlbums } from "../../hooks/useAlbums";
import { Tabs } from "../../components/Tabs";
import { CreateAlbumForm } from "./CreateAlbumForm";
import { UploadPhotos } from "./UploadPhotos";
import { Message } from "../../components/Message";
import { PhotoGallery } from "../../components/PhotoGallery";

function Albums() {

  const inputSearchRef = useRef(null);

    const { logout } = useAuth();
    const { isLoading, error, message, albums, deleteAlbum, createAlbum, uploadPhoto, deletePhoto, searchPhotos, refresh } = useAlbums();

    const [selectedAlbumId, setSelectedAlbumId] = useState('');

    const selectedAlbum = useMemo(() => {
      return  albums.find(album => album._id === selectedAlbumId);
    }, [albums, selectedAlbumId]);

    const handleSearchChange = useCallback((e) => {
      const query = e.target.value;

      if(query.length === 0) {
        refresh();
      }
    }, [refresh]);
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400">📸 Your Albums</h1>

          <div className="w-24">
            <Button title='Logout' variations="secondary" onClick={logout} />
          </div>
        </div>

        { error && <Message message={error} variations="error" />}
        { message && <Message message={message} variations="success" />}

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg my-8">
            <Tabs tabs={[
                {
                    title: 'Search Photos',
                    content: (
                        <div className="flex gap-2">
                            <Input 
                                ref={inputSearchRef}
                                type="search" 
                                placeholder="Search..."
                                onChange={handleSearchChange}
                            />
                            <Button title='Search' variations="primary" onclick={() => searchPhotos(inputSearchRef.current.value)} />
                        </div>
                    )
                },
                {
                    title: 'Create Album',
                    content: <CreateAlbumForm isLoading={isLoading} createAlbum={createAlbum} />
                }
            ]} />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-400">Suggested Albums</h2>
          {isLoading && <p className="w-full text-center">Loading...</p>}
          {albums.length === 0 && <p className="w-full text-center">No albums found.</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {albums.map((album) => (
              <Button key={album._id} onClick={() => setSelectedAlbumId(album._id)} variations={selectedAlbumId === album._id ? 'primary' : 'outline'}>
                <div className="flex flex-col">
                  <h3>{album.album_name}</h3>
                  <small className="text-gray-300">{album.description}</small>
                </div>
              </Button>
            ))}
          </div>
        </div>

        { selectedAlbum &&<div className="bg-gray-800 p-2 rounded-lg shadow-lg my-8">
            <Tabs initialActive={-1} tabs={[
                {
                  title: 'Upload photos',
                  content: <UploadPhotos albumId={selectedAlbum._id} onSubmit={uploadPhoto} />
                },
                {
                  title: 'Delete Album',
                  content: isLoading ? (
                    <Message message="Deleting..." variations="none" />
                  ) : (
                    <div className="p-4 border border-red-600 rounded-lg bg-red-900">
                    <Message message={`Are you sure you want to delete ${selectedAlbum.album_name}? This action cannot be undone.`} variations="none" />
                    <Button title="Delete" variations="danger" onClick={() => deleteAlbum(selectedAlbum._id)} className='mx-auto' />
                    </div>
                  )
                }
            ]} />
        </div>}

        <div>
          {selectedAlbum && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-semibold mb-4 text-blue-400">Photos in {selectedAlbum.album_name}</h2>
                  {isLoading && <Message message="Loading..." variations="none" />}
                  {selectedAlbum?.photos.length === 0 && <p>No photos found.</p>}
                  <PhotoGallery albumId={selectedAlbum._id} photos={selectedAlbum.photos} onDelete={deletePhoto} />
              </div>
            )}
        </div>
      </div>
    )
}

export default Albums;