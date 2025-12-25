import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaBoxOpen, FaBuilding, FaCalendarAlt, FaExclamationTriangle, FaPhoneAlt, FaSearch, FaSpinner, FaUser } from 'react-icons/fa';

const API = import.meta.env.VITE_API;

function Outstanding() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Config Header
    const headersConfig = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
        }
    };

    // ดึงข้อมูล
    const fetchUnreturnedItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/borrows`, headersConfig);

            // กรองเอาเฉพาะสถานะ "borrow" (คือยังยืมอยู่ ยังไม่ได้คืน)
            const activeBorrows = res.data.filter(item => item.status === 'borrow');

            // เรียงลำดับตามวันกำหนดคืน (ใกล้คืนก่อน ขึ้นก่อน)
            activeBorrows.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

            setItems(activeBorrows);
        } catch (err) {
            console.error("Error fetching unreturned items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnreturnedItems();
    }, []);

    // ฟังก์ชันเช็คว่าเกินกำหนดหรือยัง
    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        const today = new Date();
        const due = new Date(dueDate);
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);
        return today > due; // ถ้าวันนี้ มากกว่า วันกำหนดส่ง = เกินกำหนด
    };

    // กรองข้อมูลค้นหา
    const filteredData = items.filter(item =>
        item.user_fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supply_item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supply_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user_department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/src/assets/L1.jpg')" }}>

            {/* Main Container with Glassmorphism */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 min-h-[85vh]">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-full text-red-600 shadow-sm animate-pulse">
                            <FaExclamationTriangle className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">รายการพัสดุค้างส่ง</h1>
                            <p className="text-gray-500 text-sm">ตรวจสอบรายการที่ยังไม่ได้คืนและเกินกำหนด</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            placeholder="ค้นหารายการ..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-400 focus:outline-none transition-all shadow-sm bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                            <FaSpinner className="animate-spin text-5xl mb-4 text-red-500" />
                            <p className="text-xl font-medium">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto pb-4">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-700 uppercase font-bold tracking-wider text-base">
                                    <tr>
                                        <th className="px-6 py-5 w-[5%] text-center rounded-tl-lg">#</th>
                                        <th className="px-6 py-5 w-[20%]">ผู้ยืม / สังกัด</th>
                                        <th className="px-6 py-5 w-[25%]">รายการพัสดุ</th>
                                        <th className="px-6 py-5 w-[15%]">เบอร์โทร</th>
                                        <th className="px-6 py-5 w-[10%] text-center">จำนวน</th>
                                        <th className="px-6 py-5 w-[12%] text-center">วันที่ยืม</th>
                                        <th className="px-6 py-5 w-[13%] text-center rounded-tr-lg">กำหนดคืน</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => {
                                            const overdue = isOverdue(item.due_date);
                                            return (
                                                <tr key={item._id} className={`transition-colors text-base group ${overdue ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}`}>

                                                    <td className={`px-6 py-5 text-center font-medium ${overdue ? 'text-red-600' : 'text-gray-500'}`}>
                                                        {index + 1}
                                                    </td>

                                                    {/* ผู้ยืม & สังกัด */}
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                                                <FaUser className="text-gray-400 text-sm" />
                                                                {item.user_fullname}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <FaBuilding className="text-gray-400 text-xs" />
                                                                {item.user_department}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* พัสดุ */}
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${overdue ? 'bg-red-200 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                                                <FaBoxOpen className="text-lg" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-gray-800">{item.supply_item}</div>
                                                                <div className="text-sm font-mono text-blue-600">{item.supply_number}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* เบอร์โทร */}
                                                    <td className="px-6 py-5 text-gray-600 font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <FaPhoneAlt className="text-gray-400 text-xs" />
                                                            {item.phone || "-"}
                                                        </div>
                                                    </td>

                                                    {/* จำนวน */}
                                                    <td className="px-6 py-5 text-center">
                                                        <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm font-bold text-gray-700 shadow-sm">
                                                            {item.amount}
                                                        </span>
                                                    </td>

                                                    {/* วันที่ยืม */}
                                                    <td className="px-6 py-5 text-center text-gray-600">
                                                        {new Date(item.borrow_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                                                    </td>

                                                    {/* กำหนดคืน */}
                                                    <td className="px-6 py-5 text-center">
                                                        <div className={`flex flex-col items-center ${overdue ? 'text-red-600' : 'text-green-600'}`}>
                                                            <div className="flex items-center gap-1 font-bold">
                                                                <FaCalendarAlt />
                                                                {new Date(item.due_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                                                            </div>
                                                            {overdue && (
                                                                <span className="text-[10px] font-bold bg-red-100 px-2 py-0.5 rounded-full mt-1 border border-red-200">
                                                                    เกินกำหนด
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-20 text-center text-gray-400 text-lg">
                                                <div className="flex flex-col items-center gap-3">
                                                    <FaBoxOpen className="text-5xl opacity-20" />
                                                    <span>ไม่พบรายการพัสดุค้างส่งในขณะนี้</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Outstanding;