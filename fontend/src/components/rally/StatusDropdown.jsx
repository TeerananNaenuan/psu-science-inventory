import { useEffect, useRef, useState } from "react";


// ฟังก์ชันสำหรับแสดง dropdown ที่มีสถานะของครุภัณฑ์
const statusOptions = [
    { value: "พร้อมใช้งาน", label: "พร้อมใช้งาน", color: "bg-green-500 text-white w-[130px]", icon: "✅" },
    { value: "ชำรุด", label: "ชำรุด", color: "bg-yellow-500 text-white w-[130px]", icon: "🛠️" },
    { value: "เสื่อมสภาพ", label: "เสื่อมสภาพ", color: "bg-orange-400 text-white w-[130px]", icon: "🟧" },
    { value: "สูญหาย", label: "สูญหาย", color: "bg-red-500 text-white w-[130px]", icon: "❌" },
];

function CustomStatusDropdown({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const selected = statusOptions.find(opt => opt.value === value) || statusOptions[0];

    return (
        <div ref={ref} className="flex justify-center relative w-full">
            <button
            
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`inline-flex items-start justify-start px-2 py-1 rounded hover:bg-gray-400 font-semibold text-sm ${selected.color} cursor-pointer relative`}
                style={{ minWidth: "140px", minHeight: "30px" }}
            >
                {selected.icon && <span className="mr-1">{selected.icon}</span>}
                <span>{selected.label}</span>
                <span className="ml-auto absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs pointer-events-none">▼</span>
            </button>
            {open && (
                <ul className="absolute left-1/2 -translate-x-1/2 top-[110%] min-w-[130px] z-20 mt-1 px-2 rounded bg-white shadow-lg border border-gray-400  py-2 ">
                    {statusOptions.map(opt => (
                        <li
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`inline-flex items-start justify-start px-3 py-1 rounded font-semibold text-sm ${opt.color} w-[130px] cursor-pointer mb-1 last:mb-0`}
                            style={{ minHeight: "32px" }}
                        >
                            {opt.icon && <span className="mr-1">{opt.icon}</span>}
                            <span>{opt.label}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CustomStatusDropdown;