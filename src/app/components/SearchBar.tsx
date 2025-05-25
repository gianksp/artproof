"use client";

export function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      placeholder="Search events..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
    />
  );
}
