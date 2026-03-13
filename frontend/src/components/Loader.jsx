import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-2" />
      <p className="text-gray-500 font-medium">Loading...</p>
    </div>
  );
}
