import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { doctorAPI, patientAPI } from "../../services/api";
import AdminLayout from "../../components/Layout/AdminLayout";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospitalName: string;
}

interface PatientFormData {
  name: string;
  age: string;
  gender: "Male" | "Female" | "Other";
  phone: string;
  address: string;
  hospitalName: string;
  doctor: string;
  complaint: string;
}

const PatientRegistration = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitalDoctors, setHospitalDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState<PatientFormData>({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    address: "",
    hospitalName: "",
    doctor: "",
    complaint: "",
  });

  const [message, setMessage] = useState<{
    type: "error" | "success" | "";
    text: string;
  }>({ type: "", text: "" });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getDoctors();
      setDoctors(response.data);
    } catch {
      setMessage({ type: "error", text: "Error fetching doctors" });
    }
  };

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (name === "hospitalName") {
      const filtered = doctors.filter(
        (doc) => doc.hospitalName === value
      );
      setHospitalDoctors(filtered);
      setFormData((p) => ({ ...p, doctor: "" }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const patientData = {
        ...formData,
        age: parseInt(formData.age) || 0,
      };
      await patientAPI.registerPatient(patientData);
      setMessage({
        type: "success",
        text: "Patient registered successfully",
      });

      setFormData({
        name: "",
        age: "",
        gender: "Male",
        phone: "",
        address: "",
        hospitalName: "",
        doctor: "",
        complaint: "",
      });

      setHospitalDoctors([]);
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Error registering patient",
      });
    }
  };

  const hospitals = [...new Set(doctors.map((d) => d.hospitalName))];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Register Patient
        </h1>
        <p className="text-gray-500 mt-1">
          Today's OPD Registration
        </p>
        <div className="w-20 h-1 bg-blue-600 rounded-full mt-2" />
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 mb-4 rounded-xl border shadow ${
            message.type === "error"
              ? "bg-red-50 border-red-300 text-red-700"
              : "bg-green-50 border-green-300 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Patient Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="peer w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label
              className={`absolute left-4 bg-white px-1 text-gray-500 transition-all
                ${
                  formData.name
                    ? "-top-2 text-xs text-blue-600"
                    : "top-3"
                }
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              `}
            >
              Patient Name
            </label>
          </div>

          {/* Age + Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Age */}
            <div className="relative">
              <input
                type="number"
                name="age"
                min={1}
                value={formData.age}
                onChange={handleChange}
                required
                className="peer w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />

              <label
                className={`absolute left-4 bg-white px-1 text-gray-500 transition-all
                  ${
                    formData.age
                      ? "-top-2 text-xs text-blue-600"
                      : "top-3"
                  }
                  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
                `}
              >
                Age
              </label>
            </div>

            {/* Gender */}
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="peer w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <label
                className={`absolute left-4 bg-white px-1 text-gray-500 transition-all
                  ${
                    formData.gender
                      ? "-top-2 text-xs text-blue-600"
                      : "top-3"
                  }
                  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
                `}
              >
                Gender
              </label>
            </div>
          </div>

          {/* Phone */}
          <div className="relative">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="peer w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <label
              className={`absolute left-4 bg-white px-1 text-gray-500 transition-all
                ${
                  formData.phone
                    ? "-top-2 text-xs text-blue-600"
                    : "top-3"
                }
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              `}
            >
              Phone Number
            </label>
          </div>

          {/* Address */}
          <div className="relative">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="peer w-full h-24 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
            />

            <label
              className={`absolute left-4 bg-white px-1 text-gray-500 transition-all
                ${
                  formData.address
                    ? "-top-2 text-xs text-blue-600"
                    : "top-3"
                }
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              `}
            >
              Address
            </label>
          </div>

          {/* Hospital */}
          <div className="relative">
            <select
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleChange}
              required
              className="peer w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Hospital</option>
              {hospitals.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            <label
              className={`absolute left-4 bg-white px-1 text-gray-500 transition-all
                ${
                  formData.hospitalName
                    ? "-top-2 text-xs text-blue-600"
                    : "top-3"
                }
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              `}
            >
              Hospital Name
            </label>
          </div>

          {/* Doctor */}
          <div className="relative">
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              disabled={!formData.hospitalName}
              className={`peer w-full px-4 py-3 rounded-xl border border-gray-300 bg-white
                focus:ring-2 focus:ring-blue-500
                ${!formData.hospitalName && "bg-gray-100"}
              `}
            >
              <option value="">Select Doctor</option>
              {hospitalDoctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} — {d.specialization}
                </option>
              ))}
            </select>

            <label
              className={`absolute left-4 bg-white px-1 text-gray-500 transition-all
                ${
                  formData.doctor
                    ? "-top-2 text-xs text-blue-600"
                    : "top-3"
                }
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              `}
            >
              Doctor
            </label>
          </div>

          {/* Complaint */}
          <div className="relative">
            <textarea
              name="complaint"
              value={formData.complaint}
              onChange={handleChange}
              required
              className="peer w-full h-24 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <label
              className={`absolute left-4 bg-white px-1 text-gray-500 transition-all
                ${
                  formData.complaint
                    ? "-top-2 text-xs text-blue-600"
                    : "top-3"
                }
                peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              `}
            >
              Complaint / Symptoms
            </label>
          </div>

          {/* Submit */}
          <button
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg font-semibold transition"
          >
            Register Patient
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default PatientRegistration;
