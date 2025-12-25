import { PlusIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import { FaEdit, FaSearch, FaSpinner, FaTrash, FaUserCircle, FaUserCog } from 'react-icons/fa';
import PopupAdd from './popupmanageuser/popup_add';
import PopupDelete from './popupmanageuser/popup_delete';
import PopupEdit from './popupmanageuser/popup_edit';

const API = import.meta.env.VITE_API;

const roleLabels = {
  admin: 'ผู้ดูแลระบบ',
  samo: 'สโมสร',
  rally: 'ชุมนุม',
  user: 'ผู้ใช้งาน'
};

// ฟังก์ชันสำหรับเลือกสีป้าย Role
const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'samo': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'rally': return 'bg-orange-100 text-orange-700 border-orange-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

function Manage_User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  // ฟังก์ชันกรองผู้ใช้
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.department?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    user.phone?.toLowerCase().includes(search.toLowerCase()) ||
    user.role?.toLowerCase().includes(search.toLowerCase())
  );

  // For edit
  const [editForm, setEditForm] = useState({
    _id: null,
    username: '',
    password: '',
    department: '',
    email: '',
    fullname: '',
    phone: '',
    role: '',
    image: '',
  });

  // For add
  const [addForm, setAddForm] = useState({
    username: '',
    password: '',
    department: '',
    email: '',
    fullname: '',
    phone: '',
    role: 'admin',
    image: '',
  });

  // ดึงข้อมูล user
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/users`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handlers for Modals
  const openAddModal = () => {
    setAddForm({
      username: '',
      password: '',
      department: '',
      email: '',
      fullname: '',
      phone: '',
      role: 'admin',
      image: '',
    });
    setShowAddModal(true);
  };

  const openEditModal = (user) => {
    setEditForm({
      _id: user._id,
      username: user.username,
      password: '',
      department: user.department,
      email: user.email,
      fullname: user.fullname,
      phone: user.phone,
      role: user.role,
      image: user.image
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => setShowEditModal(false);
  const closeAddModal = () => setShowAddModal(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Handlers
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const emailExists = users.some(u => u.email === editForm.email && u._id !== editForm._id);
    if (emailExists) return alert('อีเมลนี้ถูกใช้ไปแล้ว');

    const token = localStorage.getItem('token');
    let payload = { ...editForm };
    if (!payload.password || payload.password.trim() === '') delete payload.password;

    try {
      const res = await fetch(`${API}/users/${editForm._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('แก้ไขผู้ใช้ล้มเหลว');

      await fetchUsers();
      closeEditModal();
      alert('แก้ไขข้อมูลสำเร็จ');
    } catch (err) {
      alert('แก้ไขข้อมูลล้มเหลว');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const emailExists = users.some(u => u.email === addForm.email);
    if (emailExists) return alert('อีเมลนี้ถูกใช้ไปแล้ว');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'เพิ่มผู้ใช้ล้มเหลว');
      }
      await fetchUsers();
      closeAddModal();
      alert('เพิ่มผู้ใช้สำเร็จ');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('ลบผู้ใช้ล้มเหลว');
      setUsers((prev) => prev.filter((u) => u._id !== selectedUser._id));
      setDeleteModalOpen(false);
      setSelectedUser(null);
      alert('ลบผู้ใช้สำเร็จ');
    } catch (err) {
      alert('ลบผู้ใช้ล้มเหลว');
    }
  };

  return (
    <div className="p-4 min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/src/assets/L1.jpg')" }}
    >
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50">
        
        {/* Header Section (ปรับตัวหนังสือให้ใหญ่ขึ้น) */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            
            {/* ไอคอนวงกลมสีเหลือง */}
            <div className="p-4 bg-yellow-100 rounded-full text-yellow-600 shadow-sm">
               <FaUserCog className="w-10 h-10" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">จัดการผู้ใช้งาน</h1>
              <p className="text-gray-600 text-base">ดูแลรายชื่อและสิทธิ์การใช้งานระบบ</p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="ค้นหาผู้ใช้..."
                // ปรับขนาด font และ padding ของช่องค้นหา
                className="w-full pl-10 pr-4 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              // ปรับปุ่มให้ใหญ่ขึ้น
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
              onClick={openAddModal}
            >
              <PlusIcon className="h-6 w-6" />
              เพิ่มผู้ใช้
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
                {/* เพิ่มขนาด Font Header */}
                <thead className="bg-gray-100 text-gray-700 uppercase font-bold tracking-wider text-base">
                  <tr>
                    <th className="px-6 py-5 w-[5%] text-center">#</th>
                    <th className="px-6 py-5 w-[10%] text-center">รูปโปรไฟล์</th>
                    <th className="px-6 py-5 w-[15%]">ชื่อผู้ใช้</th>
                    <th className="px-6 py-5 w-[15%]">ชื่อ-นามสกุล</th>
                    <th className="px-6 py-5 w-[13%]">สังกัด</th>
                    <th className="px-6 py-5 w-[15%] text-center">สิทธิ์</th>
                    <th className="px-6 py-5 w-[15%]">ติดต่อ</th>
                    <th className="px-6 py-5 w-[15%] text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, idx) => (
                      // เพิ่มขนาด Font ในแต่ละแถว เป็น text-base (16px)
                      <tr key={user._id || idx} className="hover:bg-yellow-50/50 transition-colors text-base">
                        <td className="px-6 py-5 text-center text-gray-500 font-medium">{idx + 1}</td>
                        
                        {/* รูป Avatar */}
                        <td className="px-6 py-5 flex justify-center">
                          <div className="w-12 h-12 rounded-full border border-gray-200 overflow-hidden bg-gray-100">
                            {user.image ? (
                              <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <FaUserCircle className="w-full h-full text-gray-300 p-1" />
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5 font-bold text-gray-800">{user.username}</td>
                        <td className="px-6 py-5 text-gray-700">{user.fullname}</td>
                        <td className="px-6 py-5 text-gray-600">{user.department}</td>
                        
                        {/* Role Badge */}
                        <td className="px-6 py-5 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getRoleBadgeColor(user.role)}`}>
                            {roleLabels[user.role] || user.role}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-gray-600 text-sm space-y-1">
                          <div className="flex items-center gap-2 truncate max-w-[180px]">📧 {user.email}</div>
                          <div className="flex items-center gap-2">📞 {user.phone}</div>
                        </td>

                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              className="p-2.5 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors tooltip shadow-sm"
                              onClick={() => openEditModal(user)}
                              title="แก้ไขข้อมูล"
                            >
                              <FaEdit className="text-lg" />
                            </button>
                            <button
                              className="p-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors shadow-sm"
                              onClick={() => handleDelete(user)}
                              title="ลบผู้ใช้"
                            >
                              <FaTrash className="text-lg" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-16 text-center text-gray-400 text-lg">
                        ไม่พบข้อมูลผู้ใช้งาน
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
      {deleteModalOpen && selectedUser && (
        <PopupDelete
          user={selectedUser}
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
  );
}

export default Manage_User;