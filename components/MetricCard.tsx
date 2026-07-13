'use client';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = 'text-green-700',
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
          {subtitle ? <p className="mt-1 text-xs text-gray-400">{subtitle}</p> : null}
        </div>
        {icon ? <span className="text-3xl">{icon}</span> : null}
      </div>
    </div>
  );
}
