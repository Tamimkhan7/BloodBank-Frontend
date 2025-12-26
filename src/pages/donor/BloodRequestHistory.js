import { useEffect, useState } from "react";
import { getMyBloodRequests } from "../../api/api";

export default function BloodRequestHistory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getMyBloodRequests().then(res => setData(res.data));
  }, []);

  return (
    <div className="pt-24 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Blood Requests</h2>

      {data.map(r => (
        <div key={r.id} className="border p-4 mb-3 rounded">
          <p><b>Blood:</b> {r.bloodGroup}</p>
          <p><b>Status:</b> {r.status}</p>
          {r.adminReply && (
            <p className="text-green-700">
              <b>Admin Reply:</b> {r.adminReply}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
