import axios from 'axios';
import { createPortal } from 'react-dom';
import { FaBoxOpen, FaCheckCircle, FaClipboardList, FaImage, FaTimes, FaTimesCircle, FaUser } from 'react-icons/fa';

const API = import.meta.env.VITE_API;

function PopupReturnDetail({ item, onClose, onSuccess }) {
    if (!item) return null;

    // ฟังก์ชันกด "ยืนยันรับคืน"
    const handleApproveReturn = async () => {
        if (!window.confirm(`ยืนยันการรับคืนพัสดุ "${item.supply_item}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API}/borrows/return/${item._id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("รับคืนพัสดุเรียบร้อยแล้ว!");
            onSuccess();
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาด: " + (err.response?.data || err.message));
        }
    };

    // ฟังก์ชันกด "ปฏิเสธการคืน"
    const handleRejectReturn = async () => {
        const reason = prompt("ระบุเหตุผลที่ปฏิเสธ (เช่น ของชำรุด, หลักฐานไม่ชัดเจน):");
        if (!reason) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API}/borrows/reject-return/${item._id}`,
                { reject_reason: reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("ปฏิเสธการคืนเรียบร้อย");
            onSuccess();
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาด");
        }
    };

    // ใช้ createPortal
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Popup Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">

                {/* Header Gradient (Orange-Red for Return Check) */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center gap-3 text-white shadow-md flex-shrink-0">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                        <FaClipboardList className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-wide">ตรวจสอบการคืนพัสดุ</h2>
                        <p className="text-orange-100 text-xs opacity-90">ตรวจสอบความถูกต้องของพัสดุและหลักฐาน</p>
                    </div>
                    <button onClick={onClose} className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors">
                        <FaTimes />
                    </button>
                </div>

                {/* Content (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar">

                    {/* ข้อมูลผู้คืน */}
                    <div className="bg-orange-50 rounded-xl p-4 mb-4 border border-orange-100 flex items-start gap-4">
                        <div className="bg-white p-3 rounded-full text-orange-500 shadow-sm">
                            <FaUser />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-1">ข้อมูลผู้แจ้งคืน</h3>
                            <p className="text-gray-900 font-bold text-lg leading-tight">{item.user_fullname}</p>
                            <p className="text-gray-500 text-sm">{item.user_department || 'ไม่ระบุสังกัด'}</p>
                        </div>
                    </div>

                    {/* ข้อมูลพัสดุ */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FaBoxOpen className="text-gray-400" /> รายละเอียดพัสดุ
                        </h3>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs mb-0.5">ชื่อพัสดุ</p>
                                <p className="font-bold text-gray-800 text-base">{item.supply_item}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-0.5">รหัสพัสดุ</p>
                                <p className="font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded inline-block">
                                    {item.supply_number}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-0.5">จำนวนที่คืน</p>
                                <p className="font-bold text-gray-800 text-lg">{item.amount} <span className="text-xs font-normal text-gray-500">ชิ้น</span></p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs mb-0.5">วันที่แจ้งคืน</p>
                                <p className="font-bold text-gray-800">
                                    {item.due_date ? new Date(item.due_date).toLocaleDateString('th-TH') : '-'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* หลักฐานรูปภาพ */}
                    <div className="mb-2">
                        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FaImage className="text-gray-400" /> หลักฐานการคืน
                        </h3>
                        <div className="w-full bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 min-h-[250px] flex items-center justify-center overflow-hidden relative group">
                            {(item.return_image || item.image_retern) ? (
                                <>
                                    <img
                                        src={item.return_image || item.image_retern}
                                        alt="หลักฐานการคืน"
                                        className="w-full h-full object-contain max-h-[400px] hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                                        onClick={() => window.open(item.return_image || item.image_retern, '_blank')}
                                    />
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        คลิกเพื่อดูรูปเต็ม
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <FaImage className="text-4xl mb-2 opacity-50" />
                                    <span>ไม่มีรูปภาพหลักฐานแนบมา</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={handleRejectReturn}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-red-600 bg-white border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                    >
                        <FaTimesCircle /> ปฏิเสธ
                    </button>
                    <button
                        onClick={handleApproveReturn}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg transform active:scale-95 transition-all"
                    >
                        <FaCheckCircle /> ยืนยันรับคืน
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default PopupReturnDetail;