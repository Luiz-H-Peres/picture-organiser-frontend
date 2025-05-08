import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate(); // Hook to navigate to other pages

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center p-6">
      <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeIn">
        📸 Welcome to Picture Organizer
      </h1>
      <p className="text-lg md:text-2xl mb-6 animate-fadeIn">
        Organize, view, and manage your favorite moments!
      </p>

      <button
        onClick={() => navigate("/albums")}
        className="bg-white text-blue-600 px-6 py-3 text-lg font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
      >
        Go to Albums 📂
      </button>
    </div>
  );
}

export default Home;
