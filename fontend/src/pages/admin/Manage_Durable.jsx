import { PlusIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { FaBoxOpen, FaEdit, FaImage, FaSearch, FaSpinner, FaTrash } from 'react-icons/fa';
import StatusBadge from '../../components/admin/StatusBadge';
import PopupAdd from './popupdurable/popup_add';
import PopupDelete from './popupdurable/popup_delete';
import PopupEdit from './popupdurable/popup_edit';

const API = import.meta.env.VITE_API;

function Manage_Durable() {
  const [durables, setDurables] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDurable, setSelectedDurable] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter Logic
  const filteredDurables = durables.filter(d =>
    d.asset_number?.toLowerCase().includes(search.toLowerCase()) ||
    d.item?.toLowerCase().includes(search.toLowerCase()) ||
    d.department?.toLowerCase().includes(search.toLowerCase()) ||
    d.budget_year?.toString().includes(search) ||
    d.status?.toLowerCase().includes(search.toLowerCase())
  );

  // Forms State
  const [editForm, setEditForm] = useState({ _id: null, asset_number: '', item: '', department: '', budget_year: '', image: '', status: '', quantity: '' });
  const [addForm, setAddForm] = useState({ asset_number: '', item: '', department: '', budget_year: '', image: '', status: 'พร้อมใช้งาน', quantity: '' });

  const headersConfig = { "Content-Type": "application/json" };

  // Fetch Data
  const fetchDurables = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/durables`, { headers: headersConfig });
      const data = await res.json();
      setDurables(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDurables(); }, []);

  // Modal Handlers
  const openAddModal = () => {
    setAddForm({ asset_number: '', item: '', department: '', budget_year: '', image: '', status: 'พร้อมใช้งาน', quantity: '' });
    setShowAddModal(true);
  };
  const openEditModal = (durable) => {
    setEditForm(durable);
    setShowEditModal(true);
  };
  const handleDelete = (durable) => {
    setSelectedDurable(durable);
    setDeleteModalOpen(true);
  };
  const handleImageDetail = (durable) => {
    if (durable.image) window.open(durable.image, '_blank');
  };

  const handleEditChange = (e) => setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAddChange = (e) => setAddForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Submit Handlers
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/durables/${editForm._id}`, { method: 'PUT', headers: headersConfig, body: JSON.stringify(editForm) });
      if (!res.ok) throw new Error('Failed');
      const updated = await res.json();
      setDurables(prev => prev.map(d => d._id === updated._id ? updated : d));
      setShowEditModal(false);
      alert('แก้ไขสำเร็จ');
    } catch (err) { alert('ล้มเหลว'); }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/durables`, { method: 'POST', headers: headersConfig, body: JSON.stringify(addForm) });
      if (!res.ok) throw new Error('Failed');
      const newDurable = await res.json();
      setDurables(prev => [...prev, newDurable]);
      setShowAddModal(false);
      alert('เพิ่มสำเร็จ');
    } catch (err) { alert(err.message); }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API}/durables/${selectedDurable._id}`, { method: 'DELETE', headers: headersConfig });
      if (!res.ok) throw new Error('Failed');
      setDurables(prev => prev.filter(d => d._id !== selectedDurable._id));
      setDeleteModalOpen(false);
      alert('ลบสำเร็จ');
    } catch (err) { alert('ล้มเหลว'); }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100 bg-cover bg-fixed" style={{ backgroundImage: "url('/src/assets/L1.jpg')" }}>
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
              <FaBoxOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">จัดการครุภัณฑ์</h1>
              <p className="text-gray-600 text-base">รายการทรัพย์สินทั้งหมดในระบบ</p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="ค้นหาครุภัณฑ์..."
                className="w-full pl-10 pr-4 py-3 text-base rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={openAddModal}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <PlusIcon className="h-6 w-6" /> เพิ่มครุภัณฑ์
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-80 bg-gray-50 text-gray-400">
              <FaSpinner className="animate-spin text-5xl mb-4 text-yellow-500" />
              <p className="text-xl">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase font-bold tracking-wider text-base">
                  <tr>
                    <th className="px-6 py-5 w-[5%] text-center">#</th>
                    <th className="px-6 py-5 w-[15%]">เลขทะเบียน</th>
                    <th className="px-6 py-5 w-[20%]">ชื่อรายการ</th>
                    <th className="px-6 py-5 w-[10%]">รูปภาพ</th>
                    <th className="px-6 py-5 w-[10%] text-center">ปีงบ</th>
                    <th className="px-6 py-5 w-[15%]">สังกัด</th>
                    <th className="px-6 py-5 w-[10%] text-center">สถานะ</th>
                    <th className="px-6 py-5 w-[5%] text-center">จำนวน</th>
                    <th className="px-6 py-5 w-[10%] text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredDurables.length > 0 ? (
                    filteredDurables.map((durable, idx) => (
                      <tr key={durable._id || idx} className="hover:bg-yellow-50/50 transition-colors text-base">
                        <td className="px-6 py-5 text-center text-gray-500 font-medium">{idx + 1}</td>

                        <td className="px-6 py-5 font-mono font-bold text-blue-600">
                          {durable.asset_number}
                        </td>

                        <td className="px-6 py-5 font-medium text-gray-800">
                          {durable.item}
                        </td>

                        {/* Column รูปภาพ (เป็น Thumbnail) */}
                        <td className="px-6 py-5">
                          {durable.image ? (
                            <div
                              className="w-16 h-12 rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity bg-gray-50"
                              onClick={() => handleImageDetail(durable)}
                              title="คลิกเพื่อดูรูปใหญ่"
                            >
                              <img src={durable.image} alt="item" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                              <FaImage />
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-5 text-center text-gray-600">
                          {durable.budget_year}
                        </td>

                        <td className="px-6 py-5 text-gray-600">
                          {durable.department}
                        </td>

                        <td className="px-6 py-5 text-center">
                          <StatusBadge status={durable.status} />
                        </td>

                        <td className="px-6 py-5 text-center font-bold text-gray-700">
                          {durable.quantity}
                        </td>

                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => openEditModal(durable)}
                              className="p-2.5 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors shadow-sm"
                              title="แก้ไข"
                            >
                              <FaEdit className="text-lg" />
                            </button>
                            <button
                              onClick={() => handleDelete(durable)}
                              className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors shadow-sm"
                              title="ลบ"
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="px-6 py-16 text-center text-gray-400 text-lg">
                        ไม่พบข้อมูลครุภัณฑ์
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {deleteModalOpen && selectedDurable && (
        <PopupDelete durable={selectedDurable} onCancel={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} />
      )}
      {showEditModal && (
        <PopupEdit formData={editForm} onChange={handleEditChange} onCancel={() => setShowEditModal(false)} onSubmit={handleEditSubmit} />
      )}
      {showAddModal && (
        <PopupAdd formData={addForm} onChange={handleAddChange} onCancel={() => setShowAddModal(false)} onSubmit={handleAddSubmit} />
      )}
    </div>
  );
}

export default Manage_Durable;