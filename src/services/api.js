const API_URL = 'http://192.168.0.103:3000';

const getToken = () => {
  return localStorage.getItem("token")
}

export const fetchAlbums = async (userId) => {

  const token = getToken();

  if (!token || !userId) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/api/albums?user_id=${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else if (data.error) {
    throw new Error(data.error);
  }

  throw new Error(`Failed to fetch albums. Status: ${response.status}`);
};

export const uploadPhotos = async ({ albumId, formData }) => {
  const token = getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/api/albums/${albumId}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else if (data.error) {
    throw new Error(data.error);
  }
}

export const createAlbum = async ({ albumName, albumDescription }) => {

  const token = getToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/albums`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      album_name: albumName,
      description: albumDescription,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else if (data.error) {
    throw new Error(data.error);
  }

  throw new Error(`Failed to create album. Status: ${response.status}`);
};

export const deleteAlbum = async (albumId) => {

  const token = getToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/albums/${albumId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else if (data.error) {
    throw new Error(data.error);
  }

  throw new Error(`Failed to delete album. Status: ${response.status}`);
}

export const deletePhoto = async (albumId, photoId) => {
  const token = getToken();

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/albums/${albumId}/photos/${photoId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else if (data.error) {
    throw new Error(data.error);
  }
}

export const searchPhotos = async (query) => {
  const token = getToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(`${API_URL}/api/search/${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else if (data.error) {
    throw new Error(data.error);
  }
}

/**
 * AUTHENTICATION
 */

export const fetchByApiToken = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  if (response.status === 401) {
    throw new Error("Invalid credentials. Please check your email and password.");
  } else {
    throw new Error("An error occurred during login.");
  }
}

export const fetchRegistration = async ({ username, email, password }) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  }

  switch (response.status) {
    case 409:
      throw new Error("Email already in use. Please use a different email.");

    case 400:
      throw new Error(data.error);

    default:
      throw new Error("An error occurred during registration.");
  }
};