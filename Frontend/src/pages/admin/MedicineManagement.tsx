import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { medicineAPI } from "../../services/api";
import AdminLayout from "../../components/Layout/AdminLayout";

interface Medicine {
  _id: string;
  name: string;
  genericName: string;
  strength: string;
  type: "Tablet" | "Syrup" | "Injection";
  company: string;
}

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const [formData, setFormData] = useState<Omit<Medicine, "_id">>({
    name: "",
    genericName: "",
    strength: "",
    type: "Tablet",
    company: "",
  });

  const [message, setMessage] = useState<{
    type: "error" | "success" | "";
    text: string;
  }>({
    type: "",
    text: "",
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.getMedicines();
      setMedicines(response.data);
    } catch {
      setMessage({ type: "error", text: "Error fetching medicines" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingMedicine) {
        await medicineAPI.updateMedicine(editingMedicine._id, formData);
        setMessage({ type: "success", text: "Medicine updated successfully" });
      } else {
        await medicineAPI.createMedicine(formData);
        setMessage({ type: "success", text: "Medicine added successfully" });
      }

      setShowForm(false);
      setEditingMedicine(null);

      setFormData({
        name: "",
        genericName: "",
        strength: "",
        type: "Tablet",
        company: "",
      });

      fetchMedicines();
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message || "Error saving medicine",
      });
    }
  };

  const handleEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      name: medicine.name,
      genericName: medicine.genericName,
      strength: medicine.strength,
      type: medicine.type,
      company: medicine.company,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this medicine?"))
      return;

    try {
      await medicineAPI.deleteMedicine(id);
      setMessage({
        type: "success",
        text: "Medicine deleted successfully",
      });
      fetchMedicines();
    } catch {
      setMessage({ type: "error", text: "Error deleting medicine" });
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Medicine Management
          </h1>
          <div className="w-24 h-1 bg-blue-600 rounded-full mt-2"></div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          {showForm ? "Cancel" : "Add Medicine"}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div
          className={`p-4 mb-6 rounded-lg font-semibold text-white shadow ${
            message.type === "error" ? "bg-gray-500" : "bg-green-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 mb-10">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">
            {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Medicine Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Generic Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Generic Name
              </label>
              <input
                type="text"
                name="genericName"
                required
                value={formData.genericName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Strength */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Strength
              </label>
              <input
                type="text"
                name="strength"
                required
                value={formData.strength}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="Tablet">Tablet</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
              </select>
            </div>

            {/* Company */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
              >
                {editingMedicine ? "Update Medicine" : "Add Medicine"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-x-auto">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Name",
                  "Generic Name",
                  "Strength",
                  "Type",
                  "Company",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left font-semibold text-gray-700 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {medicines.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{m.name}</td>
                  <td className="px-6 py-4">{m.genericName}</td>
                  <td className="px-6 py-4">{m.strength}</td>
                  <td className="px-6 py-4">{m.type}</td>
                  <td className="px-6 py-4">{m.company}</td>

                  {/* Buttons */}
                  <td className="px-6 py-4 space-x-2">
                    <button
                      className="px-3 py-1 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white"
                      onClick={() => handleEdit(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleDelete(m._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!medicines.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No medicines found.
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

export default MedicineManagement;
