import { useState } from 'react';
import { FaClipboardList, FaTasks, FaUndoAlt } from 'react-icons/fa';
import Loan_request from './Loan_request';
import Return_request from './Return_request';

function Samo_Package() {
    const [activeTab, setActiveTab] = useState("borrow_request");

    return (
        <div className="p-4 min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/src/assets/L1.jpg')" }}>

            {/* Main Container with Glassmorphism */}
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 min-h-[85vh]">

                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 border-b border-gray-100 pb-6">

                    {/* Title */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600 shadow-sm">
                            <FaTasks className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">ระบบจัดการคำขอ</h1>
                            <p className="text-gray-500 text-sm">อนุมัติการยืมและตรวจสอบการคืนพัสดุ</p>
                        </div>
                    </div>

                    {/* Modern Segmented Tabs */}
                    <div className="flex bg-gray-100 p-1.5 rounded-xl gap-1 w-full md:w-auto shadow-inner">
                        <button
                            onClick={() => setActiveTab("borrow_request")}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "borrow_request"
                                ? "bg-yellow-500 text-white shadow-md transform scale-100"
                                : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                }`}
                        >
                            <FaClipboardList /> คำขอยืม (รออนุมัติ)
                        </button>
                        <button
                            onClick={() => setActiveTab("return_request")}
                            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "return_request"
                                ? "bg-red-500 text-white shadow-md transform scale-100"
                                : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                }`}
                        >
                            <FaUndoAlt /> คำขอคืน (รอตรวจสอบ)
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="min-h-[500px] animate-fade-in-up">
                    {activeTab === "borrow_request" && <Loan_request />}
                    {activeTab === "return_request" && <Return_request />}
                </div>
            </div>
        </div>
    );
}

export default Samo_Package;