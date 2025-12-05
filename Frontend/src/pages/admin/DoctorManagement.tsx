import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { doctorAPI } from "../../services/api";
import AdminLayout from "../../components/Layout/AdminLayout";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  phone: string;
  hospitalName: string;
  role: string;
}

interface FormData {
  name: string;
  email: string;
  specialization: string;
  phone: string;
  hospitalName: string;
  password: string;
  role: string; 
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    specialization: "",
    phone: "",
    hospitalName: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getDoctors();
      setDoctors(response.data);
    } catch {
      setMessage({ type: "error", text: "Failed to fetch doctors" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingDoctor) {
        await doctorAPI.updateDoctor(editingDoctor._id, formData);
        setMessage({ type: "success", text: "Doctor updated successfully" });
      } else {
        await doctorAPI.createDoctor(formData);
        setMessage({ type: "success", text: "Doctor created successfully" });
      }

      resetForm();
      fetchDoctors();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error saving doctor",
      });
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      phone: doctor.phone,
      hospitalName: doctor.hospitalName,
      password: "",
      role: doctor.role,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await doctorAPI.deleteDoctor(id);
      setMessage({ type: "success", text: "Doctor deleted successfully" });
      fetchDoctors();
    } catch {
      setMessage({ type: "error", text: "Error deleting doctor" });
    }
  };

  const resetForm = () => {
    setEditingDoctor(null);
    setFormData({
      name: "",
      email: "",
      specialization: "",
      phone: "",
      hospitalName: "",
      password: "",
      role: "",
    });
    setShowForm(false);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Doctor Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            {showForm ? "Cancel" : "Add Doctor"}
          </button>
        </div>
        <div className="w-24 h-1 mt-2 bg-blue-600 rounded-full"></div>
      </div>

      {message.text && (
        <div
          className={`mb-4 p-4 rounded-lg font-semibold text-white shadow-md ${
            message.type === "error" ? "bg-gray-500" : "bg-green-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">
            {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {["name", "email", "specialization", "phone", "hospitalName"].map((field) => (
              <div key={field}>
                <label className="block mb-1 text-gray-600 font-medium">
                  {field === "hospitalName"
                    ? "Hospital Name"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field as keyof FormData]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}

            {/* Role Select */}
            <div>
              <label className="block mb-1 text-gray-600 font-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Administrator</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            {!editingDoctor && (
              <div>
                <label className="block mb-1 text-gray-600 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              >
                {editingDoctor ? "Update Doctor" : "Create Doctor"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading doctors...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {["Name", "Email", "Specialization", "Phone", "Hospital", "Role", "Actions"].map(
                  (heading) => (
                    <th key={heading} className="px-6 py-3 text-left font-medium text-gray-700">
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">{doctor.name}</td>
                  <td className="px-6 py-3">{doctor.email}</td>
                  <td className="px-6 py-3">{doctor.specialization}</td>
                  <td className="px-6 py-3">{doctor.phone}</td>
                  <td className="px-6 py-3">{doctor.hospitalName}</td>
                  <td className="px-6 py-3">{doctor.role}</td>

                  <td className="px-6 py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="px-3 py-1 rounded-md bg-yellow-400 text-white hover:bg-yellow-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(doctor._id)}
                      className="px-3 py-1 rounded-md bg-purple-500 text-white hover:bg-purple-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!doctors.length && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default DoctorManagement;
