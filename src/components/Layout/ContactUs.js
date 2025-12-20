import { useState } from "react";
import { sendContactMessage } from "../../api/api";
import { MapPin, Mail, MessageSquare } from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendContactMessage(form);
      alert("Message sent successfully!");
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl p-10">

        {/* LEFT SIDE – CONTACT INFO */}
        <div className="space-y-6 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-red-600">Contact Us</h1>
          <p className="text-gray-700 text-lg">
            Send us your message. We’ll get back to you as soon as possible.
          </p>

          <div className="space-y-4 text-gray-700 mt-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-red-600 mt-1" size={20} />
              <span>Mirpur, Dhaka-1216, Bangladesh</span>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="text-red-600 mt-1" size={20} />
              <span>01582896328 (Only SMS)</span>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-red-600 mt-1" size={20} />
              <span>infoprimebloodbank@rokto.com</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE – FORM */}
        <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-red-600">
            Contact Us Online
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />

            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />

            <input
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              required
            />

            <textarea
              placeholder="Write your message..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              rows={6}
              required
            />

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-semibold text-white"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
