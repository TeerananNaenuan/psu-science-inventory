import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaBoxOpen, FaBuilding, FaCheckCircle, FaExchangeAlt, FaHistory, FaSearch, FaSpinner, FaTimesCircle, FaUser } from 'react-icons/fa';

const API = import.meta.env.VITE_API;

function History_all() {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Config Header
    const headersConfig = {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json"
        }
    };

    // ดึงข้อมูลประวัติทั้งหมด
    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/history`, headersConfig);
            setHistoryData(res.data);
        } catch (err) {
            console.error("Error fetching history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    // Helper: สถานะและการตกแต่ง
    const getStatusConfig = (type) => {
        switch (type?.toLowerCase()) {
            case 'return':
                return { 
                    label: 'คืนสำเร็จ', 
                    style: 'bg-green-100 text-green-700 border border-green-200',
                    icon: <FaCheckCircle />
                };
            case 'borrow':
                return { 
                    label: 'ยืมสำเร็จ', 
                    style: 'bg-blue-100 text-blue-700 border border-blue-200',
                    icon: <FaExchangeAlt />
                };
            case 'reject_borrow':
                return { 
                    label: 'ปฏิเสธการยืม', 
                    style: 'bg-red-100 text-red-700 border border-red-200',
                    icon: <FaTimesCircle />
                };
            case 'reject_return':
                return { 
                    label: 'ปฏิเสธการคืน', 
                    style: 'bg-orange-100 text-orange-700 border border-orange-200',
                    icon: <FaTimesCircle />
                };
            default:
                return { 
                    label: type, 
                    style: 'bg-gray-100 text-gray-600 border border-gray-200',
                    icon: null
                };
        }
    };

    // กรองข้อมูลค้นหา
    const filteredData = historyData.filter(item => {
        const dateText = item.action_date
            ? new Date(item.action_date).toLocaleDateString('th-TH')
            : "";
        return (
            item.user_fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.supply_item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.supply_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dateText.includes(searchTerm)
        );
    });

    return (
        <div className="p-4 min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/src/assets/L1.jpg')" }}>
            
            {/* Main Container */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 min-h-[85vh]">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
                    
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600 shadow-sm">
                           <FaHistory className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">ประวัติการทำรายการ</h1>
                            <p className="text-gray-500 text-sm">ตรวจสอบข้อมูลการยืม-คืนย้อนหลังทั้งหมด</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            placeholder="ค้นหาประวัติ..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all shadow-sm bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                            <FaSpinner className="animate-spin text-5xl mb-4 text-blue-500" />
                            <p className="text-xl font-medium">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto pb-4">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-700 uppercase font-bold tracking-wider text-base">
                                    <tr>
                                        <th className="px-6 py-5 w-[5%] text-center rounded-tl-lg">#</th>
                                        <th className="px-6 py-5 w-[20%]">ผู้ดำเนินการ</th>
                                        <th className="px-6 py-5 w-[25%]">รายการพัสดุ</th>
                                        <th className="px-6 py-5 w-[15%] text-center">สถานะ</th>
                                        <th className="px-6 py-5 w-[10%] text-center">จำนวน</th>
                                        <th className="px-6 py-5 w-[15%] text-center">วัน-เวลาทำรายการ</th>
                                        <th className="px-6 py-5 w-[10%] text-center rounded-tr-lg">กำหนดคืน</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item, index) => {
                                            const status = getStatusConfig(item.action_type);
                                            return (
                                                <tr key={item._id || index} className="hover:bg-blue-50/30 transition-colors text-base group">
                                                    
                                                    <td className="px-6 py-5 text-center text-gray-500 font-medium">
                                                        {index + 1}
                                                    </td>
                                                    
                                                    {/* ผู้ดำเนินการ */}
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 font-bold text-gray-800">
                                                                <FaUser className="text-gray-400 text-xs" />
                                                                {item.user_fullname}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                <FaBuilding className="text-gray-400 text-[10px]" />
                                                                {item.user_department}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    
                                                    {/* รายการพัสดุ */}
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-white transition-colors">
                                                                <FaBoxOpen />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-gray-800">{item.supply_item}</div>
                                                                <div className="text-xs font-mono text-blue-600">{item.supply_number}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* สถานะ */}
                                                    <td className="px-6 py-5 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${status.style}`}>
                                                            {status.icon}
                                                            {status.label}
                                                        </span>
                                                    </td>

                                                    {/* จำนวน */}
                                                    <td className="px-6 py-5 text-center">
                                                        <span className="bg-gray-50 text-gray-700 font-bold px-3 py-1 rounded-md border border-gray-200 text-sm">
                                                            {item.amount}
                                                        </span>
                                                    </td>

                                                    {/* วันเวลาทำรายการ */}
                                                    <td className="px-6 py-5 text-center">
                                                        {item.action_date ? (
                                                            <div className="flex flex-col text-sm text-gray-600">
                                                                <span className="font-bold text-gray-800">
                                                                    {new Date(item.action_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                                                                </span>
                                                                <span className="text-xs">
                                                                    {new Date(item.action_date).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                                                                </span>
                                                            </div>
                                                        ) : '-'}
                                                    </td>

                                                    {/* กำหนดคืน */}
                                                    <td className="px-6 py-5 text-center text-gray-500 text-sm">
                                                        {item.due_date
                                                            ? new Date(item.due_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
                                                            : '-'
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-20 text-center text-gray-400 text-lg">
                                                <div className="flex flex-col items-center gap-3">
                                                    <FaHistory className="text-5xl opacity-20" />
                                                    <span>ไม่พบประวัติการทำรายการ</span>
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

export default History_all;