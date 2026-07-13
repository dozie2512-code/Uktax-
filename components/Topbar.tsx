'use client';

interface Props {
  title: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: Props) {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white px-4">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 transition-colors hover:bg-gray-100 lg:hidden"
        aria-label="Open menu"
      >
        <span className="mb-1 block h-0.5 w-5 bg-gray-600" />
        <span className="mb-1 block h-0.5 w-5 bg-gray-600" />
        <span className="block h-0.5 w-5 bg-gray-600" />
      </button>
      <h1 className="text-base font-semibold text-gray-800">{title}</h1>
    </header>
  );
}
