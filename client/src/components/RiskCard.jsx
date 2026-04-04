export default function RiskCard({ risk }) {
  if (!risk) return null;

  const color =
    risk === "CRITICAL"
      ? "text-red-600"
      : risk === "HIGH"
        ? "text-red-400"
        : risk === "MEDIUM"
          ? "text-yellow-400"
          : "text-green-400";

  return (
    <div className="mt-4 w-full max-w-md bg-slate-800 p-4 rounded-xl">
      <p className={`font-bold ${color}`}>⚠️ Risk: {risk}</p>
    </div>
  );
}
