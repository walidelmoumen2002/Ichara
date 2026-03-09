import { MaterialIcon } from "@/components/shared/material-icon";

interface StatCardProps {
  value: string;
  label: string;
  icon: string;
}

export function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="glass flex items-center gap-4 rounded-xl p-5 shadow-lg transform transition hover:-translate-y-1 duration-300">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-accent">
        <MaterialIcon name={icon} className="text-2xl" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-300">{label}</p>
      </div>
    </div>
  );
}
