import { useEffect, useState } from "react";
import { doctorAPI, medicineAPI, patientAPI } from "../../services/api";
import AdminLayout from "../../components/Layout/AdminLayout";
import { FaUserMd, FaPills, FaUserInjured } from "react-icons/fa";

interface Stats {
  doctors: number;
  medicines: number;
  patients: number;
}

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  address?: string;
  complaint?: string;
  doctor?: {
    name: string;
  };
  registrationDate: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    doctors: 0,
    medicines: 0,
    patients: 0,
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, medicinesRes, patientsRes] = await Promise.all([
          doctorAPI.getDoctors(),
          medicineAPI.getMedicines(),
          patientAPI.getAllPatients(),
        ]);

        setStats({
          doctors: doctorsRes.data.length,
          medicines: medicinesRes.data.length,
          patients: patientsRes.data.length,
        });

        setPatients(patientsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-lg font-medium text-gray-500">
          Loading...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of system statistics</p>
        <div className="w-20 h-1 mt-2 bg-blue-600 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {/* Doctors */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex items-center gap-4 transition hover:shadow-xl">
          <div className="w-14 h-14 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-3xl">
            <FaUserMd />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Doctors</h3>
            <p className="text-4xl font-bold text-blue-600 mt-1">{stats.doctors}</p>
          </div>
        </div>

        {/* Medicines */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex items-center gap-4 transition hover:shadow-xl">
          <div className="w-14 h-14 flex items-center justify-center bg-green-100 text-green-700 rounded-full text-3xl">
            <FaPills />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Medicines</h3>
            <p className="text-4xl font-bold text-green-600 mt-1">{stats.medicines}</p>
          </div>
        </div>

        {/* Patients */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex items-center gap-4 transition hover:shadow-xl">
          <div className="w-14 h-14 flex items-center justify-center bg-red-100 text-red-700 rounded-full text-3xl">
            <FaUserInjured />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total Patients</h3>
            <p className="text-4xl font-bold text-red-600 mt-1">{stats.patients}</p>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Patients</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((p) => (
                <tr key={p._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.phone || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.doctor?.name || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{p.complaint || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(p.registrationDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
