import { Plus, Info } from "lucide-react";

export default function Header({
  onMenuClick,
  onSwitchView,
  onInfoClick,
  view,
}) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">🐧 Kororā Mode</h1>

      <div className="flex items-center gap-3">
        {/* View toggle */}
        <button
          onClick={onSwitchView}
          className="text-sm px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 transition"
        >
          {view === "scan" ? "Activity" : "Scan"}
        </button>

        {/* Info */}
        <button
          onClick={onInfoClick}
          className="p-1 text-gray-400 hover:text-white"
        >
          <Info size={18} />
        </button>

        {/* Add */}
        <button
          onClick={onMenuClick}
          className="bg-blue-500 p-1.5 rounded-full hover:bg-blue-600 transition"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}
