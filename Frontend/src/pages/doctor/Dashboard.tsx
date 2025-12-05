import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { patientAPI } from "../../services/api";
import DoctorLayout from "../../components/Layout/DoctorLayout";

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  complaint: string;
  registrationDate: string;
  prescription?: {
    items?: any[];
  };
}

const Dashboard = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayPatients();
  }, []);

  const fetchTodayPatients = async () => {
    try {
      const response = await patientAPI.getTodayPatients();
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      hour12: true,
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleViewPatient = (id: string) => {
    navigate(`/doctor/prescription/${id}`);
  };

  return (
    <DoctorLayout>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Today's Patients</h1>
        <p className="text-gray-500 mt-1">Doctor Dashboard</p>
        <div className="w-20 h-1 mt-2 bg-blue-600 rounded-full"></div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 text-lg animate-pulse">
          Loading patients...
        </div>
      ) : patients.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-lg rounded-xl p-10 text-center text-gray-600">
          No patients registered today.
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100/70">
              <tr>
                {[
                  "Name",
                  "Age",
                  "Gender",
                  "Complaint",
                  "Registration Time",
                  "Status",
                  "Action",
                ].map((title) => (
                  <th
                    key={title}
                    className="px-6 py-4 text-left text-gray-700 font-semibold tracking-wide"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {patients.map((p) => {
                const prescribed = (p.prescription?.items?.length ?? 0) > 0;

                return (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50/70 transition-all"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {p.name}
                    </td>

                    <td className="px-6 py-4 text-gray-700">{p.age}</td>

                    <td className="px-6 py-4 text-gray-700">{p.gender}</td>

                    <td className="px-6 py-4 text-gray-700">
                      {p.complaint}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(p.registrationDate)}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold shadow
                        ${
                          prescribed
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                        }`}
                      >
                        {prescribed ? "Prescribed" : "Pending"}
                      </span>
                    </td>

                    {/* Button */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewPatient(p._id)}
                        className={`px-4 py-2 rounded-xl text-white font-semibold shadow-md transition active:scale-95
                          ${
                            prescribed
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-green-600 hover:bg-green-700"
                          }
                        `}
                      >
                        {prescribed ? "View / Edit" : "Prescribe"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DoctorLayout>
  );
};

export default Dashboard;
