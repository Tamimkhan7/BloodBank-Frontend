import { useState } from "react";
import { login } from "../../api/api";
import { saveToken } from "../../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ Email: email, Password: password });
      saveToken(res.data.token);
      window.location.href = "/dashboard";
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-600">Login</h2>
        <input className="w-full border p-2 mb-3" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full border p-2 mb-4" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-red-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
