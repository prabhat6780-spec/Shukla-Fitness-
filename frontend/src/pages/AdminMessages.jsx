import { useEffect, useState } from "react";
import API from "../api";
import AdminLayout from "../components/Admin/AdminLayout";
import { FaTrash } from "react-icons/fa";
import "../css/AdminMessages.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH
  const fetchMessages = async () => {
    try {
      const res = await API.get("/contact");
      setMessages(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await API.delete(`/contact/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  // ✅ REPLY
  const handleReply = async (id, reply, index) => {
    if (!reply) return alert("Write reply first");

    try {
      await API.put(`/contact/${id}/reply`, { reply });

      alert("Reply sent ✅");

      const updated = [...messages];
      updated[index].replied = true;
      setMessages(updated);

    } catch {
      alert("Failed ❌");
    }
  };

  // ✅ MARK AS READ
  const markAsRead = async (id, index) => {
    try {
      await API.put(`/contact/${id}/read`);

      const updated = [...messages];
      updated[index].isRead = true;
      setMessages(updated);

    } catch {
      console.log("Failed to mark as read");
    }
  };

  return (
    <AdminLayout>
      <div className="msg-page">
        <div className="msg-container">

          <h2 className="msg-title">User Messages 📩</h2>

          {loading ? (
            <p>Loading...</p>
          ) : messages.length === 0 ? (
            <p>No messages found</p>
          ) : (
            <div className="msg-list">

              {messages.map((msg, index) => (
                <div
                  key={msg._id}
                  className={`msg-card ${!msg.isRead ? "unread" : ""}`}
                  onClick={() => {
                    if (!msg.isRead) {
                      markAsRead(msg._id, index);
                    }
                  }}
                >

                  {/* HEADER */}
                  <div className="msg-header">
                    <h3>{msg.name}</h3>

                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // 🔥 important
                        handleDelete(msg._id);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* DETAILS */}
                  <p className="msg-email">{msg.email}</p>
                  <p className="msg-phone">{msg.phone}</p>

                  {/* USER MESSAGE */}
                  <p className="msg-text">{msg.message}</p>

                  {/* ✅ SHOW REPLY */}
                  {msg.replied && (
                    <div className="msg-reply-box">
                      <strong>Your Reply:</strong>
                      <p>{msg.reply}</p>
                    </div>
                  )}

                  {/* ✅ TEXTAREA */}
                  <textarea
                    placeholder="Write reply..."
                    value={msg.reply || ""}
                    onClick={(e) => e.stopPropagation()} // 🔥
                    onChange={(e) => {
                      const updated = [...messages];
                      updated[index].reply = e.target.value;
                      setMessages(updated);
                    }}
                  />

                  {/* ✅ SEND BUTTON */}
                  <button
                    className="reply-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥
                      handleReply(msg._id, msg.reply, index);
                    }}
                  >
                    Send Reply
                  </button>

                  {/* DATE */}
                  <span className="msg-date">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;