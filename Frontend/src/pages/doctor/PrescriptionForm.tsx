import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { patientAPI, medicineAPI } from "../../services/api";
import DoctorLayout from "../../components/Layout/DoctorLayout";

interface PrescriptionItem {
  medicine: string;
  dosage: string;
  duration: string;
  notes?: string;
}

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  complaint: string;
  registrationDate: string;
  prescription?: { items?: PrescriptionItem[] };
}

interface Medicine {
  _id: string;
  name: string;
  genericName: string;
  strength: string;
  type: string;
}

interface Message {
  type: "success" | "error" | "";
  text: string;
}

const PrescriptionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([
    { medicine: "", dosage: "", duration: "", notes: "" },
  ]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;

    try {
      const [patientRes, medicineRes] = await Promise.all([
        patientAPI.getPatient(id),
        medicineAPI.getMedicines(),
      ]);

      setPatient(patientRes.data);
      setMedicines(medicineRes.data);

      if (patientRes.data.prescription?.items?.length) {
        setPrescriptionItems(patientRes.data.prescription.items);
      }
    } catch {
      setMessage({ type: "error", text: "Error loading data" });
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index: number, field: keyof PrescriptionItem, value: string) => {
    setPrescriptionItems((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addMedicine = () => {
    setPrescriptionItems((prev) => [...prev, { medicine: "", dosage: "", duration: "", notes: "" }]);
  };

  const removeMedicine = (index: number) => {
    setPrescriptionItems((prev) => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const items = prescriptionItems
        .filter((item) => item.medicine && item.dosage && item.duration)
        .map((item) => ({
          medicine: item.medicine,
          dosage: item.dosage,
          duration: item.duration,
          notes: item.notes || "",
        }));

      if (items.length === 0) {
        setMessage({ type: "error", text: "Please add at least one medicine" });
        setSubmitting(false);
        return;
      }

      await patientAPI.issuePrescription(id, { items });

      setMessage({ type: "success", text: "Prescription saved successfully" });

      setTimeout(() => navigate("/doctor/dashboard"), 1800);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error saving prescription",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DoctorLayout>
        <div className="text-center py-20 text-gray-500 text-xl animate-pulse">
          Loading prescription...
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <button
        className="mb-6 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl transition shadow"
        onClick={() => navigate("/doctor/dashboard")}
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-4">Prescription Form</h1>
      <div className="w-24 h-1 bg-blue-600 rounded-full mb-6"></div>

      {/* Patient Card */}
      {patient && (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Patient Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Complaint:</strong> {patient.complaint}</p>
            <p><strong>Registration:</strong> {new Date(patient.registrationDate).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Message */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-xl shadow border text-lg font-medium ${
            message.type === "error"
              ? "bg-red-50 text-red-700 border-red-300"
              : "bg-green-50 text-green-700 border-green-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Prescription Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl p-6"
      >
        {prescriptionItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 bg-white rounded-xl p-5 mb-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Medicine {index + 1}
              </h4>

              {prescriptionItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicine(index)}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Medicine Dropdown */}
              <div>
                <label className="text-gray-700 font-medium mb-1 block">Medicine</label>
                <select
                  value={item.medicine}
                  onChange={(e) => handleItemChange(index, "medicine", e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Medicine</option>
                  {medicines.map((med) => (
                    <option key={med._id} value={med._id}>
                      {med.name} ({med.genericName}) • {med.strength} • {med.type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dosage */}
              <div>
                <label className="text-gray-700 font-medium mb-1 block">Dosage</label>
                <input
                  type="text"
                  value={item.dosage}
                  onChange={(e) => handleItemChange(index, "dosage", e.target.value)}
                  placeholder="e.g. 1-0-1"
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="text-gray-700 font-medium mb-1 block">Duration</label>
                <input
                  type="text"
                  value={item.duration}
                  onChange={(e) => handleItemChange(index, "duration", e.target.value)}
                  placeholder="e.g. 5 days"
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-gray-700 font-medium mb-1 block">
                  Notes (Optional)
                </label>
                <textarea
                  value={item.notes}
                  onChange={(e) => handleItemChange(index, "notes", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addMedicine}
          className="mb-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow transition"
        >
          + Add Medicine
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
        >
          {submitting ? "Saving..." : "Save Prescription"}
        </button>
      </form>
    </DoctorLayout>
  );
};

export default PrescriptionForm;
