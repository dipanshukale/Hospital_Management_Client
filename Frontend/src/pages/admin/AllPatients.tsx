import { useState, useEffect } from "react";
import { patientAPI } from "../../services/api";
import AdminLayout from "../../components/Layout/AdminLayout";

interface Doctor {
  _id: string;
  name: string;
  hospitalName?: string;
}

interface PrescriptionItem {
  name: string;
  dosage: string;
}

interface Prescription {
  items: PrescriptionItem[];
}

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  doctor?: Doctor;
  hospitalName: string;
  complaint: string;
  registrationDate: string;
  prescription?: Prescription;
}

const AllPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await patientAPI.getAllPatients();
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleString();

  return (
    <AdminLayout>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Patients</h1>
        <p className="text-gray-500 mt-1">Full OPD patient list</p>
        <div className="w-20 h-1 mt-2 bg-blue-600 rounded-full"></div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading...</div>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-700">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Age</th>
                <th className="p-3 border-b">Gender</th>
                <th className="p-3 border-b">Phone</th>
                <th className="p-3 border-b">Doctor</th>
                <th className="p-3 border-b">Hospital</th>
                <th className="p-3 border-b">Complaint</th>
                <th className="p-3 border-b">Registered</th>
                <th className="p-3 border-b">Prescription</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {patients.map((patient) => (
                <tr
                  key={patient._id}
                  className="hover:bg-gray-50 transition border-b"
                >
                  <td className="p-3">{patient.name}</td>
                  <td className="p-3">{patient.age}</td>
                  <td className="p-3">{patient.gender}</td>
                  <td className="p-3">{patient.phone}</td>
                  <td className="p-3">{patient.doctor?.name || "N/A"}</td>
                  <td className="p-3">{patient.doctor?.hospitalName || "N/A"}</td>
                  <td className="p-3">{patient.complaint}</td>
                  <td className="p-3">{formatDate(patient.registrationDate)}</td>
                  <td className="p-3">
                    {patient.prescription?.items?.length ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Issued
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AllPatients;
