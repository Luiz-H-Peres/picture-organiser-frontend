import { useEffect, useState } from "react";

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [showRegisterPage, setShowRegisterPage] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  useEffect(() => {
    if (token && userId) {
      fetchAlbums();
    }
  }, [token, userId]);

  const fetchAlbums = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/albums?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAlbums(data);
      } else {
        alert("Failed to fetch albums.");
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  const handleLogin = async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        setToken(data.token);
        setUserId(data.userId);
        setIsAuthenticated(true);
        setShowLandingPage(false);
        fetchAlbums();
      } else {
        alert("Invalid credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async () => {
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        alert("Registration successful! Please log in.");
        setShowRegisterPage(false);
      } else {
        alert("Registration failed. Email may already be in use.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken("");
    setUserId("");
    setIsAuthenticated(false);
    setShowLandingPage(true);
  };

  const handleCreateAlbum = async () => {
    if (!albumName.trim()) {
      alert("Album name is required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          album_name: albumName,
          description: albumDescription,
        }),
      });

      if (response.ok) {
        alert("Album created successfully!");
        fetchAlbums();
        setAlbumName("");
        setAlbumDescription("");
      } else {
        alert("Failed to create album.");
      }
    } catch (error) {
      console.error("Error creating album:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadPhoto = async (albumId) => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);

    // Log the FormData to ensure the file is appended
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/albums/${albumId}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Photo uploaded successfully!");
        fetchAlbums();
        setSelectedFile(null);
      } else {
        alert("Failed to upload photo.");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showLandingPage ? (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-center p-6">
          <h1 className="text-4xl font-bold mb-4 text-blue-400">📸 Welcome to Picture Organizer</h1>
          <p className="text-lg mb-6 text-gray-300">Easily organize and manage your photo albums.</p>

          {isAuthenticated ? (
            <button
              onClick={() => setShowLandingPage(false)}
              className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition duration-300"
            >
              Go to Albums
            </button>
          ) : showRegisterPage ? (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Create an Account</h2>
              <input
                id="regUsername"
                type="text"
                placeholder="Username"
                className="border border-gray-600 p-2 w-full mt-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              <input
                id="regEmail"
                type="email"
                placeholder="Email"
                className="border border-gray-600 p-2 w-full mt-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              <input
                id="regPassword"
                type="password"
                placeholder="Password"
                className="border border-gray-600 p-2 w-full mt-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleRegister}
                className="bg-blue-500 text-white px-6 py-3 mt-4 rounded-md w-full hover:bg-blue-600 transition duration-300"
              >
                Register
              </button>
              <button
                onClick={() => setShowRegisterPage(false)}
                className="text-gray-300 mt-3 underline hover:text-blue-400 transition duration-300"
              >
                Already have an account? Login
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-blue-400">Login</h2>
              <input
                id="loginEmail"
                type="email"
                placeholder="Email"
                className="border border-gray-600 p-2 w-full mt-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              <input
                id="loginPassword"
                type="password"
                placeholder="Password"
                className="border border-gray-600 p-2 w-full mt-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-6 py-3 mt-4 rounded-md w-full hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegisterPage(true)}
                className="text-gray-300 mt-3 underline hover:text-blue-400 transition duration-300"
              >
                Don't have an account? Register
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-blue-400">📸 Your Albums</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Create New Album</h2>
            <input
              type="text"
              placeholder="Album Name"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              className="border border-gray-600 p-2 w-full rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 mb-3"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={albumDescription}
              onChange={(e) => setAlbumDescription(e.target.value)}
              className="border border-gray-600 p-2 w-full rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 mb-4"
            />
            <button
              onClick={handleCreateAlbum}
              className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition duration-300"
            >
              Create Album
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-bold text-blue-400">{album.album_name}</h3>
                <p className="text-gray-300">{album.description}</p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {album.photos.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Photo ${idx}`}
                      className="rounded-md object-cover h-24 w-full"
                    />
                  ))}
                </div>
                <div className="mt-4">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="mb-2 w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />
                  <button
                    onClick={() => handleUploadPhoto(album._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition duration-300"
                  >
                    Upload Photo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;