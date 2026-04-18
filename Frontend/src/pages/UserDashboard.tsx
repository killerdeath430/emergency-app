import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRequests();
    startLocationTracking();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/requests/my");
      setRequests(res.data.requests);
    } catch {
      console.error("Failed to fetch requests");
    }
    setLoading(false);
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) return;
    setInterval(() => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await api.post("/location", {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }, 10000);
  };

  const sendRequest = async () => {
    setSending(true);
    setMessage("");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await api.post("/requests", {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setMessage(`✅ Request sent! Nearest hospital: ${res.data.request.hospital.name} (${res.data.distanceKm} km away)`);
        fetchRequests();
      } catch {
        setMessage("❌ Failed to send request");
      }
      setSending(false);
    });
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
    <div className="min-h-screen bg-red-50">
      <nav className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🚑 EmergencyConnect</h1>
        <div className="flex items-center gap-4">
          <span>Hello, {user?.name}</span>
          <button onClick={handleLogout} className="bg-white text-red-600 px-3 py-1 rounded-lg text-sm font-semibold">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6 mb-6 text-center">
          <p className="text-gray-500 mb-4">In an emergency? Request an ambulance immediately.</p>
          <button
            onClick={sendRequest}
            disabled={sending}
            className="bg-red-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:bg-red-700 transition disabled:opacity-50"
          >
            {sending ? "Sending..." : "🚨 Request Ambulance"}
          </button>
          {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </div>

        <h2 className="text-lg font-bold text-gray-700 mb-3">My Requests</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-400">No requests yet.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl shadow p-4 mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{req.hospital.name}</p>
                  <p className="text-sm text-gray-500">{req.hospital.address}</p>
                  <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[req.status]}`}>
                  {req.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}