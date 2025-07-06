import { useCallback, useState, useEffect, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../components/AuthPage";
import Homepage from "./components/Homepage";
import { Navigate } from "react-router-dom";

export default function App() {
  const [passwords, setPasswords] = useState([]);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://passvault-back.vercel.app/api/passwords ",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPasswords(res.data);
      } catch (err) {
        console.error(err);
        showToast("Failed to load passwords", "error");
      }
      setIsLoading(false);
    };
    fetchPasswords();
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!website.trim() || !username.trim() || !password.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }

    const token = localStorage.getItem("token");

    setIsSaving(true);
    try {
      if (editingIndex !== null) {
        const id = passwords[editingIndex]._id;
        await axios.put(
          `https://passvault-back.vercel.app/api/passwords/ ${id}`,
          { website, username, password },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        showToast("Password updated!", "success");
        const updated = [...passwords];
        updated[editingIndex] = {
          ...updated[editingIndex],
          website,
          username,
          password,
        };
        setPasswords(updated);
      } else {
        const res = await axios.post(
          "https://passvault-back.vercel.app/api/passwords ",
          { website, username, password },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPasswords([...passwords, res.data]);
        showToast("New password saved!", "success");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      showToast("Failed to save password", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (index) => {
    const entry = passwords[index];
    setWebsite(entry.website);
    setUsername(entry.username);
    setPassword(entry.password);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    const idToDelete = passwords[index]._id;
    if (window.confirm("Are you sure you want to delete this password?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `https://passvault-back.vercel.app/api/passwords/ ${idToDelete}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const updated = passwords.filter((_, i) => i !== index);
        setPasswords(updated);
        showToast("Password deleted", "success");
      } catch (err) {
        console.error("Error deleting password:", err);
        showToast("Error deleting password", "error");
      }
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard!", "success");
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  };

  const generatePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let newPassword = "";
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const resetForm = () => {
    setWebsite("");
    setUsername("");
    setPassword("");
    setEditingIndex(null);
  };

  const filteredPasswords = useMemo(() => {
    return passwords.filter(
      (entry) =>
        entry.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [passwords, searchTerm]);

  return (
    <Router>
  <Routes>
    <Route path="/login" element={<AuthPage isLogin={true} />} />
    <Route path="/register" element={<AuthPage isLogin={false} />} />
    <Route path="/" 
      element={
    localStorage.getItem("token") ? (
      <Homepage />
    ) : (
      <Navigate to="/login" />
    )
  }
     />
  </Routes>
</Router>
    
  );
}

// Reusable Password Card Component
const PasswordCard = React.memo(
  ({ entry, index, onEdit, onDelete, onCopy, copiedIndex }) => {
    return (
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow-md hover:shadow-2xl hover:scale-100  transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span>{entry.website.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h3 className="font-semibold">{entry.website}</h3>
              <p className="text-sm text-gray-400">@{entry.username}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => onCopy(entry.password)}
              title="Copy password"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm flex items-center gap-1 transition-transform transform hover:scale-105"
              aria-label="Copy password"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="9" y="7" width="13" height="13" rx="2" ry="2"></rect>
              </svg>
              {copiedIndex === index ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={() => onEdit(index)}
              className="text-yellow-400 hover:text-yellow-300"
              aria-label="Edit password"
            >
              <svg
                className="w-5 h-5 transition-transform hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(index)}
              className="text-red-400 hover:text-red-300"
              aria-label="Delete password"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
);
