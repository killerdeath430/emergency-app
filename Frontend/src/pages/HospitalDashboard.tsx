import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function HospitalDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hospital/requests");
      setRequests(res.data.requests);
    } catch {
      console.error("Failed to fetch");
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/hospital/requests/${id}`, { status });
      fetchRequests();
    } catch {
      console.error("Failed to update");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const statusColor: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🏥 Hospital Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="bg-white text-red-600 px-3 py-1 rounded-lg text-sm font-semibold">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-700">Incoming Requests</h2>
          <button onClick={fetchRequests} className="text-sm text-red-600 font-semibold">
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-400">No requests yet.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl shadow p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{req.user.name}</p>
                  <p className="text-sm text-gray-500">{req.user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    📍 {req.lat.toFixed(4)}, {req.lng.toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[req.status]}`}>
                  {req.status}
                </span>
              </div>
              {req.status === "PENDING" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => updateStatus(req.id, "ACCEPTED")}
                    className="flex-1 bg-green-500 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, "REJECTED")}
                    className="flex-1 bg-red-500 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
              {req.status === "ACCEPTED" && (
                <button
                  onClick={() => updateStatus(req.id, "COMPLETED")}
                  className="mt-3 w-full bg-blue-500 text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-600"
                >
                  Mark Completed
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}