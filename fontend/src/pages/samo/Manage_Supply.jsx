import { useEffect, useState } from 'react';
import { FaBoxOpen, FaCube, FaEdit, FaImage, FaPlus, FaSearch, FaSpinner, FaTrash } from 'react-icons/fa';
import PopupAdd from './popupmanagesupply/popup_add';
import PopupDelete from './popupmanagesupply/popup_delete';
import PopupEdit from './popupmanagesupply/popup_edit';

const API = import.meta.env.VITE_API;

function Manage_Supply() {
  const [supplies, setSupplies] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Filter Logic
  const filteredSupplies = supplies.filter(s =>
    s.category?.toLowerCase().includes(search.toLowerCase()) ||
    s.item?.toLowerCase().includes(search.toLowerCase()) ||
    s.supply_number?.toLowerCase().includes(search.toLowerCase())
  );

  // Form States
  const [editForm, setEditForm] = useState({ _id: null, category: '', item: '', supply_number: '', image: '', stock: '', unit: '' });
  const [addForm, setAddForm] = useState({ category: '', item: '', supply_number: '', image: '', stock: '', unit: '' });

  const headersConfig = { "Content-Type": "application/json" };

  // Fetch Data
  const fetchSupplies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/supplies`, { headers: headersConfig });
      const data = await res.json();
      setSupplies(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchSupplies(); }, []);

  // Modal Handlers
  const openAddModal = () => {
    setAddForm({ category: '', item: '', supply_number: '', image: '', stock: '', unit: '' });
    setShowAddModal(true);
  };

  const openEditModal = (supply) => {
    setEditForm({ ...supply });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditForm({ _id: null, category: '', item: '', supply_number: '', image: '', stock: '', unit: '' });
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setAddForm({ category: '', item: '', supply_number: '', image: '', stock: '', unit: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit Handlers
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/supplies/${editForm._id}`, {
        method: 'PUT', headers: headersConfig, body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchSupplies();
      closeEditModal();
      alert('แก้ไขพัสดุสําเร็จ');
    } catch (err) { alert('แก้ไขข้อมูลล้มเหลว'); }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/supplies`, {
        method: 'POST', headers: headersConfig, body: JSON.stringify(addForm),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchSupplies();
      closeAddModal();
      alert('เพิ่มพัสดุสําเร็จ');
    } catch (err) { alert(err.message); }
  };

  const handleDelete = (supply) => {
    setSelectedSupply(supply);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${API}/supplies/${selectedSupply._id}`, { method: 'DELETE', headers: headersConfig });
      if (!res.ok) throw new Error('Failed');
      setSupplies(prev => prev.filter(s => s._id !== selectedSupply._id));
      setDeleteModalOpen(false);
      setSelectedSupply(null);
      alert('ลบพัสดุสําเร็จ');
    } catch (err) { alert('ลบพัสดุล้มเหลว'); }
  };

  const handleImageDetail = (supply) => {
    if (supply.image) window.open(supply.image, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="p-4 min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/src/assets/L1.jpg')" }}>
      
      {/* Main Container with Glassmorphism */}
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 min-h-[85vh]">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 shadow-sm">
               <FaCube className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">จัดการพัสดุ</h1>
              <p className="text-gray-500 text-sm">เพิ่ม ลบ แก้ไข รายการวัสดุอุปกรณ์</p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="ค้นหาพัสดุ..."
                className="w-full pl-10 pr-4 py-3 text-base rounded-xl border border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all shadow-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Add Button */}
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:from-green-600 hover:to-green-700 transition-transform transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <FaPlus /> เพิ่มพัสดุ
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-80 text-gray-400">
              <FaSpinner className="animate-spin text-5xl mb-4 text-yellow-500" />
              <p className="text-xl">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase font-bold tracking-wider text-base">
                  <tr>
                    <th className="px-6 py-5 w-[5%] text-center rounded-tl-lg">#</th>
                    <th className="px-6 py-5 w-[15%]">หมวดหมู่</th>
                    <th className="px-6 py-5 w-[20%]">ชื่อพัสดุ</th>
                    <th className="px-6 py-5 w-[15%] font-mono">รหัสพัสดุ</th>
                    <th className="px-6 py-5 w-[10%] text-center">รูปภาพ</th>
                    <th className="px-6 py-5 w-[10%] text-center">คงเหลือ</th>
                    <th className="px-6 py-5 w-[10%] text-center">แก้ไข</th>
                    <th className="px-6 py-5 w-[10%] text-center rounded-tr-lg">ลบ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSupplies.length > 0 ? (
                    filteredSupplies.map((supply, idx) => (
                      <tr key={supply._id || idx} className="hover:bg-yellow-50/50 transition-colors text-base group">
                        <td className="px-6 py-5 text-center text-gray-500 font-medium">{idx + 1}</td>
                        
                        <td className="px-6 py-5">
                           <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-sm font-medium">
                              {supply.category}
                           </span>
                        </td>
                        
                        <td className="px-6 py-5 font-bold text-gray-800">
                           <div className="flex items-center gap-3">
                              <FaBoxOpen className="text-yellow-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                              {supply.item}
                           </div>
                        </td>

                        <td className="px-6 py-5 text-blue-600 font-mono font-medium">
                           {supply.supply_number}
                        </td>

                        <td className="px-6 py-5 text-center">
                           {supply.image ? (
                              <div 
                                 className="w-12 h-12 mx-auto rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-transform hover:scale-105 shadow-sm"
                                 onClick={() => handleImageDetail(supply)}
                                 title="คลิกเพื่อดูรูปใหญ่"
                              >
                                 <img src={supply.image} alt="img" className="w-full h-full object-cover" />
                              </div>
                           ) : (
                              <div className="w-12 h-12 mx-auto rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                                 <FaImage />
                              </div>
                           )}
                        </td>

                        <td className="px-6 py-5 text-center">
                           <span className={`font-bold text-lg ${supply.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {supply.stock}
                           </span>
                           <span className="text-xs text-gray-400 ml-1">{supply.unit}</span>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <button 
                            onClick={() => openEditModal(supply)}
                            className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 hover:text-yellow-700 transition-colors"
                            title="แก้ไข"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <button 
                            onClick={() => handleDelete(supply)}
                            className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 hover:text-red-600 transition-colors"
                            title="ลบ"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-16 text-center text-gray-400 text-lg">
                        <div className="flex flex-col items-center gap-3">
                           <FaBoxOpen className="text-5xl opacity-20" />
                           <span>ไม่พบรายการพัสดุ</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modals */}
        {deleteModalOpen && selectedSupply && (
          <PopupDelete
            supply={selectedSupply}
            onCancel={() => setDeleteModalOpen(false)}
            onConfirm={confirmDelete}
          />
        )}
        {showEditModal && (
          <PopupEdit
            formData={editForm}
            onChange={handleEditChange}
            onCancel={closeEditModal}
            onSubmit={handleEditSubmit}
          />
        )}
        {showAddModal && (
          <PopupAdd
            formData={addForm}
            onChange={handleAddChange}
            onCancel={closeAddModal}
            onSubmit={handleAddSubmit}
          />
        )}

      </div>
    </div>
  );
}

export default Manage_Supply;