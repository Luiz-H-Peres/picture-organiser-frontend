import { useState, useEffect, useCallback } from "react";
import { fetchAlbums, createAlbum as APICreateAlbum, deleteAlbum as APIDeleteAlbum, uploadPhotos as APIUploadPhoto, deletePhoto as APIDeletePhoto, searchPhotos as APISearchPhoto } from "../services/api";
import { useAuth } from "./useAuth";

export const useAlbums = () => {

    const { userId, isLoading: isLoadingAuth } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [albums, setAlbums] = useState([]);

    const refresh = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchAlbums(userId);

            setAlbums(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const createAlbum = useCallback(async ({ albumName, albumDescription }) => {
        try {
            if (isLoading) {
                return;
            }

            setIsLoading(true);
            const data = await APICreateAlbum({ albumName, albumDescription, userId });

            setMessage('Album created successfully');
            setAlbums(albums => [...albums, data]);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, userId]);

    const searchPhotos = useCallback(async (query) => {
        try {
            if (isLoading) {
                return;
            }

            setIsLoading(true);

            if (query.length < 3) {
                setError('Please enter at least 3 characters');
                return;
            }

            const result = await APISearchPhoto(query);
            setAlbums(result);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const deleteAlbum = useCallback(async (albumId) => {
        try {
            if (isLoading) {
                return;
            }

            setIsLoading(true);
            const data = await APIDeleteAlbum(albumId);

            setMessage(data.message || 'Album deleted successfully');
            setAlbums(albums => albums.filter(album => album._id !== albumId));

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const uploadPhoto = useCallback(async (data) => {
        try {
            if (isLoading) {
                return;
            }

            setIsLoading(true);

            const { formData } = data;
            const photos = formData.getAll('photos');

            for (const file of photos) {
                if (!file.type.startsWith('image/')) {
                    setError('Invalid file type. Only images are allowed.');
                    return;
                }

                if (file.size > 10 * 1024 * 1024) {
                    setError('File size exceeds the limit of 10MB.');
                    return;
                }
            }

            await APIUploadPhoto(data);
            await refresh();

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, refresh]);

    const deletePhoto = useCallback(async (albumId, photoId) => {
        try {
            if (isLoading) {
                return;
            }

            setIsLoading(true);

            await APIDeletePhoto(albumId, photoId);
            await refresh();

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, refresh]);

    useEffect(() => {
        if (isLoadingAuth) {
            return;
        }
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        refresh();
    }, [isLoadingAuth, refresh, userId]);

    return {
        isLoading,
        error,
        message,
        albums,
        refresh,
        createAlbum,
        deleteAlbum,
        uploadPhoto,
        deletePhoto,
        searchPhotos
    }
}