import { useState, useEffect } from 'react';
import { Button } from './Button';

export const PhotoGallery = ({ albumId, photos, onDelete }) => {

  const [selectedIndex, setSelectedIndex] = useState(null);

  const handlePhotoClick = (index) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handleDelete = () => {
    handleClose();
    onDelete(albumId, selectedPhoto._id)
  }

  const handlePrev = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  useEffect(() => {
    setSelectedIndex(null);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {photos.map((photo, index) => (
          <img
            key={photo._id}
            src={photo.url}
            alt={`${photo.metadata.description}`}
            title={`${photo.metadata.description}`}
            onClick={() => handlePhotoClick(index)}
            className="cursor-pointer object-cover h-32 w-full"
          />
        ))}
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center" onClick={handleClose}>
          <div className="relative text-white" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedPhoto.url}
              alt={`${selectedPhoto.metadata.description}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            <div className='absolute w-full bottom-0 left-1/2 bg-black transform -translate-x-1/2 px-4 py-2'>
              <p className='text-sm text-white w-full text-center'>{selectedPhoto.metadata.description}</p>
              <div className='flex justify-between items-center space-x-2'>
                <Button title='Delete' variations="danger" onClick={handleDelete} />
                <Button title='Close' variations="primary" onClick={handleClose} />
                { photos.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center space-x-2">
                    <button onClick={handlePrev}>
                      ⬅️
                    </button>
                    <button onClick={handleNext}>
                      ➡️
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};