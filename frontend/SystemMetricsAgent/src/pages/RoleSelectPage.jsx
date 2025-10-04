import { useNavigate } from "react-router-dom";

export default function RoleSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Title at the top center */}
      <h1 className="text-3xl font-bold mb-10">Choose Role</h1>

      {/* Row of buttons */}
      <div className="flex gap-10">
        <button
          onClick={() => navigate("/login?role=producer")}
          className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Producer
        </button>
        <button
          onClick={() => navigate("/login?role=consumer")}
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Consumer
        </button>
        <button
          onClick={() => navigate("/login?role=admin")}
          className="px-8 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition"
        >
          Admin
        </button>
      </div>
    </div>
  );
}
