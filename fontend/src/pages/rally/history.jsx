import { FaBoxOpen, FaCalendarAlt, FaCheckCircle, FaExchangeAlt, FaHistory, FaTimesCircle } from 'react-icons/fa';

function History({ data }) {

    // Helper: คืนค่าสีและไอคอนตามสถานะ
    const getStatusConfig = (type) => {
        switch (type) {
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
                    style: 'bg-gray-100 text-gray-600',
                    icon: null
                };
        }
    };

    return (
        <div className="overflow-x-auto pb-20">
            {/* Table Header (Optional: ถ้าหน้าหลักมี Header แล้ว ส่วนนี้อาจซ่อนได้) */}

            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase font-bold tracking-wider text-sm border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 w-[5%] text-center">#</th>
                        <th className="px-6 py-4 w-[20%]">รายการพัสดุ</th>
                        <th className="px-6 py-4 w-[20%] font-mono">รหัสพัสดุ</th>
                        <th className="px-6 py-4 w-[20%] text-center">วันที่ทำรายการ</th>
                        <th className="px-6 py-4 w-[10%] text-center">จำนวน</th>
                        <th className="px-6 py-4 w-[15%] text-center">สถานะ</th>
                        <th className="px-6 py-4 w-[15%] text-center">หมายเหตุ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.length > 0 ? (
                        data.map((item, index) => {
                            const status = getStatusConfig(item.action_type);
                            return (
                                <tr key={item._id || index} className="hover:bg-gray-50 transition-colors text-base group">
                                    <td className="px-6 py-5 text-center text-gray-400 font-medium">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-5 text-gray-800 font-bold">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-white transition-colors">
                                                <FaBoxOpen />
                                            </div>
                                            {item.supply_item}
                                        </div>
                                    </td>

                                    <td className="px-6 py-5 text-blue-600 font-mono font-medium text-sm">
                                        {item.supply_number}
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        {item.action_date ? (
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                                                    <FaCalendarAlt className="text-gray-400 text-xs" />
                                                    {new Date(item.action_date).toLocaleDateString('th-TH', {
                                                        year: 'numeric', month: 'short', day: 'numeric'
                                                    })}
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(item.action_date).toLocaleTimeString('th-TH', {
                                                        hour: '2-digit', minute: '2-digit'
                                                    })} น.
                                                </span>
                                            </div>
                                        ) : '-'}
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        <span className="bg-gray-100 text-gray-700 font-bold py-1 px-3 rounded-full text-sm">
                                            {item.amount}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${status.style}`}>
                                            {status.icon}
                                            {status.label}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5 text-red-600 font-mono font-medium text-sm">
                                            {item.reject_reason}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-16 text-center text-gray-400 text-lg">
                                <div className="flex flex-col items-center gap-3">
                                    <FaHistory className="text-4xl opacity-20" />
                                    <span>ไม่พบประวัติการทำรายการ</span>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default History;