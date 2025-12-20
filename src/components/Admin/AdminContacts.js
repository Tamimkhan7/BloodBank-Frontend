import { useEffect, useState } from "react";
import { getAllContactMessages } from "../../api/api";

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await getAllContactMessages();
        setMessages(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load contact messages");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  if (loading) {
    return (
      <div className="mt-24 text-center text-gray-400">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto mt-24">
      <h2 className="text-2xl font-bold mb-6 text-red-500">
        Contact Messages
      </h2>

      {messages.length === 0 && (
        <p className="text-gray-400">No messages found.</p>
      )}

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className="bg-gray-900 text-white p-4 rounded shadow"
          >
            <p><b>Name:</b> {m.name}</p>
            <p><b>Email:</b> {m.email}</p>
            <p><b>Phone:</b> {m.phone}</p>       
            <p className="mt-2"><b>Message:</b> {m.message}</p>
            <p className="text-sm text-gray-400 mt-2">
              Sent at: {new Date(m.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
