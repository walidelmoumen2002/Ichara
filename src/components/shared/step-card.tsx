import { MaterialIcon } from "@/components/shared/material-icon";

interface StepCardProps {
  icon: string;
  title: string;
  description: string;
}

export function StepCard({ icon, title, description }: StepCardProps) {
  return (
    <div className="group flex flex-col items-center rounded-2xl bg-card p-8 text-center shadow-sm border border-border transition-all hover:shadow-lg hover:border-primary/20">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        <MaterialIcon name={icon} className="text-3xl" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
