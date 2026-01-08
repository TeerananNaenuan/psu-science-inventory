import { useState } from 'react';
import { FaClipboardList, FaTasks, FaUndoAlt } from 'react-icons/fa';
import Loan_request from './Loan_request';
import Return_request from './Return_request';

function Samo_Package() {
    const [activeTab, setActiveTab] = useState("borrow_request");

    return (
        <div className="p-2 md:p-4 min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/src/assets/L1.jpg')" }}>

            <div className="bg-white/95 backdrop-blur-sm p-3 md:p-6 rounded-2xl shadow-xl border border-white/50 min-h-[85vh]">

                <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-8 gap-4 md:gap-6 border-b border-gray-100 pb-4 md:pb-6">

                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-center md:justify-start">
                        <div className="p-2 md:p-3 bg-green-100 rounded-full text-green-600 shadow-sm">
                            <FaTasks className="w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-xl md:text-3xl font-bold text-gray-800">ระบบจัดการคำขอ</h1>
                            <p className="text-gray-500 text-xs md:text-sm">อนุมัติการยืมและตรวจสอบการคืนพัสดุ</p>
                        </div>
                    </div>

                    <div className="flex bg-gray-100 p-1 md:p-1.5 rounded-xl gap-1 w-full md:w-auto shadow-inner overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("borrow_request")}
                            className={`flex items-center justify-center gap-1.5 md:gap-2 px-2 py-2 md:px-6 md:py-2.5 rounded-lg font-bold transition-all text-xs md:text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "borrow_request"
                                ? "bg-yellow-500 text-white shadow-md transform scale-100"
                                : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                }`}
                        >
                            <FaClipboardList className="text-sm md:text-base" /> คำขอยืม (รออนุมัติ)
                        </button>
                        <button
                            onClick={() => setActiveTab("return_request")}
                            className={`flex items-center justify-center gap-1.5 md:gap-2 px-2 py-2 md:px-6 md:py-2.5 rounded-lg font-bold transition-all text-xs md:text-sm whitespace-nowrap flex-1 md:flex-none ${activeTab === "return_request"
                                ? "bg-red-500 text-white shadow-md transform scale-100"
                                : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                }`}
                        >
                            <FaUndoAlt className="text-sm md:text-base" /> คำขอคืน (รอตรวจสอบ)
                        </button>
                    </div>
                </div>

                <div className="min-h-[300px] md:min-h-[500px] animate-fade-in-up">
                    {activeTab === "borrow_request" && <Loan_request />}
                    {activeTab === "return_request" && <Return_request />}
                </div>
            </div>
        </div>
    );
}

export default Samo_Package;
