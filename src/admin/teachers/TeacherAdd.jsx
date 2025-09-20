import { useState } from "react";
import AdminSidebar from "../../../components/AdminSidebar";

export default function TeacherCreate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    salary: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New teacher:", formData);
    // later => send to API
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar isOpen={true} />

      <main className="flex-1 ml-0 lg:ml-64 p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Teacher</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full border rounded p-2"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full border rounded p-2"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                className="w-full border rounded p-2"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              className="w-full border rounded p-2"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-medium">Salary (UZS)</label>
            <input
              type="number"
              name="salary"
              className="w-full border rounded p-2"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              className="w-full border rounded p-2"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Save Teacher
          </button>
        </form>
      </main>
    </div>
  );
}
