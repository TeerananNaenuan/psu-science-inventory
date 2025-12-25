import { useEffect, useRef } from "react";

//ฟังชั้นในการขยายความกว้างของ input ตามความยาวของข้อความที่ป้อนเข้าไป
function AutoWidthInput({ value, onChange, minWidth = 10, maxWidth = 290, className = "", ...props }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.style.width = "auto";
      let newWidth = input.scrollWidth + 8;
      if (newWidth > maxWidth) newWidth = maxWidth;
      input.style.width = newWidth + "px";
    }
  }, [value, minWidth, maxWidth]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={onChange}
      className={className}
      style={{ minWidth, maxWidth }}
      {...props}
    />
  );
}

export default AutoWidthInput;