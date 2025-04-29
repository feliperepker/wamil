import { LucideIcon } from "lucide-react";

interface InteractiveIconProps {
  icon: LucideIcon;
  filled?: boolean;
}

const InteractiveIcon = ({
  icon: Icon,
  filled = false,
}: InteractiveIconProps) => {
  return (
    <div className="group relative inline-block">
      {filled ? (
        <>
          <Icon
            className="size-5 text-transparent"
            style={{
              stroke: "url(#gradient-1)",
              fill: "url(#gradient-1)",
            }}
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="gradient-1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#9ec3f0" />
                <stop offset="100%" stopColor="#05b5f5" />
              </linearGradient>
            </defs>
          </svg>
        </>
      ) : (
        <>
          <Icon className="size-5 text-primary transition duration-500" />
          <Icon
            className="size-5 absolute inset-0 text-transparent transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            style={{
              stroke: "url(#gradient-2)",
            }}
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="gradient-2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#29BBF0" />
                <stop offset="100%" stopColor="#eca150" />
              </linearGradient>
            </defs>
          </svg>
        </>
      )}
    </div>
  );
};

export default InteractiveIcon;
