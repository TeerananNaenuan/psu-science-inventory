import { useEffect, useState } from 'react';
import { FaClipboardCheck, FaImage, FaSave, FaSearch, FaSpinner } from 'react-icons/fa';
import CustomStatusDropdown from '../../components/rally/StatusDropdown';

const API = import.meta.env.VITE_API;

function Rally_Durable() {
    const [durables, setDurables] = useState([]);
    const [search, setSearch] = useState("");
    const [statusChanges, setStatusChanges] = useState({});
    const [loading, setLoading] = useState(true);

    const filteredDurables = durables.filter(d =>
        d.asset_number?.toLowerCase().includes(search.toLowerCase()) ||
        d.item?.toLowerCase().includes(search.toLowerCase()) ||
        d.department?.toLowerCase().includes(search.toLowerCase()) ||
        d.budget_year?.toString().includes(search) ||
        d.status?.toLowerCase().includes(search.toLowerCase())
    );

    const headersConfig = { "Content-Type": "application/json" };

    const fetchDurables = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/durables`, { headers: headersConfig });
            const data = await res.json();
            setDurables(data);
        } catch (err) { console.error('Error:', err); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchDurables(); }, []);

    const handleImageDetail = (durable) => {
        if (durable.image) window.open(durable.image, '_blank');
    };

    const handleStatusChange = (id, value) => {
        setStatusChanges(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await Promise.all(
                Object.entries(statusChanges).map(async ([id, status]) => {
                    const res = await fetch(`${API}/durables/${id}`, {
                        method: 'PATCH',
                        headers: headersConfig,
                        body: JSON.stringify({ status }),
                    });
                    if (!res.ok) throw new Error('Update failed');
                })
            );
            await fetchDurables();
            setStatusChanges({});
            alert('อัปเดตสถานะสำเร็จ');
        } catch (err) {
            alert('อัปเดตสถานะล้มเหลว');
            setLoading(false);
        }
    };

    return (
        <div className="p-4 min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/src/assets/L1.jpg')" }}>
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                            <FaClipboardCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">ตรวจสอบครุภัณฑ์</h1>
                            <p className="text-gray-600 text-base">เช็คสถานะและอัปเดตข้อมูลพัสดุ</p>
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
                    </div>
                </div>

                {/* Table Section */}
                <div className=" overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-80 bg-gray-50 text-gray-400">
                            <FaSpinner className="animate-spin text-5xl mb-4 text-yellow-500" />
                            <p className="text-xl">กำลังโหลดข้อมูล...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto pb-40">
                            <table className="w-full text-left">
                                <thead className=" bg-gray-100 text-gray-700 uppercase font-bold tracking-wider text-base">
                                    <tr>
                                        <th className="px-6 py-5 w-[5%] text-center">#</th>
                                        <th className="px-6 py-5 w-[15%]">เลขทะเบียน</th>
                                        <th className="px-6 py-5 w-[20%]">ชื่อรายการ</th>
                                        <th className="px-6 py-5 w-[15%]">สังกัด</th>
                                        <th className="px-6 py-5 w-[10%] text-center">ปีงบ</th>
                                        <th className="px-6 py-5 w-[10%] text-center">รูปภาพ</th>
                                        <th className="px-6 py-5 w-[25%] text-center">สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredDurables.length > 0 ? (
                                        filteredDurables.map((durable, idx) => (
                                            <tr key={durable._id} className="hover:bg-yellow-50/50 transition-colors text-base">
                                                <td className="px-6 py-5 text-center text-gray-500 font-medium">{idx + 1}</td>
                                                
                                                <td className="px-6 py-5 font-mono font-bold text-blue-600">
                                                    {durable.asset_number}
                                                </td>
                                                
                                                <td className="px-6 py-5 font-medium text-gray-800">
                                                    {durable.item}
                                                </td>

                                                <td className="px-6 py-5 text-gray-600">
                                                    {durable.department}
                                                </td>

                                                <td className="px-6 py-5 text-center text-gray-600">
                                                    {durable.budget_year}
                                                </td>

                                                <td className="px-6 py-5 text-center">
                                                    {durable.image ? (
                                                        <div 
                                                            className="w-16 h-12 mx-auto rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 bg-gray-50"
                                                            onClick={() => handleImageDetail(durable)}
                                                            title="คลิกเพื่อดูรูปใหญ่"
                                                        >
                                                            <img src={durable.image} alt="img" className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-16 h-12 mx-auto rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                                                            <FaImage />
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="px-6 py-5 text-center">
                                                    <div className=" w-full max-w-[200px] mx-auto">
                                                        <CustomStatusDropdown
                                                            value={statusChanges[durable._id] ?? durable.status}
                                                            onChange={val => handleStatusChange(durable._id, val)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-16 text-center text-gray-400 text-lg">
                                                ไม่พบข้อมูลครุภัณฑ์
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer Action Bar */}
                <div className="mt-6 flex justify-end sticky bottom-4 z-20">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || Object.keys(statusChanges).length === 0}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg shadow-xl border-2 border-white transition-all transform hover:-translate-y-1 ${
                            loading || Object.keys(statusChanges).length === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900"
                        }`}
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                        {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Rally_Durable;