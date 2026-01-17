import { useState, useRef, useEffect } from "react";
import "./CustomDropdown.css";

export default function CustomDropdown({
  label,
  options,
  value,
  onChange
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="dropdown-wrapper" ref={ref}>
      <div
        className="dropdown-selected"
        onClick={() => setOpen(!open)}
      >
        {value || `Select ${label}`}
        <span className={`arrow ${open ? "up" : ""}`}>▾</span>
      </div>

      {open && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <div
              key={opt}
              className="dropdown-item"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
