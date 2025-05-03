import { Loader2 } from "lucide-react";

const Spinner = ({ size }: { size: number }) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 size={size} className="animate-spin text-muted-foreground" />
    </div>
  );
};

export default Spinner;
