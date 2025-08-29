import { cn } from "@/lib/utils"; // Make sure you have a utility for classnames

export function SketchAnimation({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={cn("sketch-animation", className)}
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* This is a simple doodle of a smiling cloud */}
        <path d="M25,75 C10,75 10,60 20,55 C15,40 30,30 45,40 C55,25 75,30 80,45 C95,45 95,60 80,65 C80,75 25,75 25,75 Z" />
        <path d="M35,60 Q40,65 45,60" />
        <path d="M55,60 Q60,65 65,60" />
        <path d="M40,50 L40,50" />
        <path d="M60,50 L60,50" />
      </g>
    </svg>
  );
}
