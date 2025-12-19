import { useState } from "react";
import { register } from "../../api/api";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register({
        FullName: form.fullName,
        Email: form.email,
        Password: form.password,
        Phone: form.phone || null,
      });
      window.location.href = "/login";
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">
          Register
        </h2>
        {["fullName", "email", "password", "phone"].map((f) => (
          <input
            key={f}
            className="w-full border p-2 mb-3"
            placeholder={f}
            type={f === "password" ? "password" : "text"}
            onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          />
        ))}
        <button className="w-full bg-red-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
