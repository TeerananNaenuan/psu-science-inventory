
//ฟังชั้นนี้ใช้สำหรับแสดงสถานะของอุปกรณ์ในรูปแบบ Badge
function StatusBadge({ status }) {
    let color = "bg-gray-300 text-gray-800";
    let icon = "";
    let text = status;

    switch (status) {
        case "พร้อมใช้งาน":
            color = "bg-green-500 text-white w-[130px]";
            icon = "✅";
            break;
        case "ชำรุด":
            color = "bg-yellow-500 text-white w-[130px]";
            icon = "🛠️";
            break;
        case "เสื่อมสภาพ":
            color = "bg-orange-400 text-white w-[130px]";
            icon = "🟧";
            break;
        case "สูญหาย":
            color = "bg-red-500 text-white w-[130px]";
            icon = "❌";
            break;
        default:
            color = "bg-gray-300 text-gray-800 w-[130px]";
    }

    return (
        <span className={`inline-flex items-start justify-start px-3 py-1 rounded font-semibold text-sm ${color}`}>
            {icon && <span className="mr-1">{icon}</span>}
            {text}
        </span>
    );
}

export default StatusBadge