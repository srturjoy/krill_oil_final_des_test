import { cn } from "@/lib/utils";

export function AutoScrollGallery({
  images,
  className,
  speed = "normal",
  height = "h-64",
}: {
  images: string[];
  className?: string;
  speed?: "slow" | "normal";
  height?: string;
}) {
  const doubled = [...images, ...images];
  return (
    <div className={cn("relative overflow-hidden mask-fade", className)}>
      <div
        className={cn(
          "flex gap-4 w-max",
          speed === "slow" ? "animate-scroll-x-slow" : "animate-scroll-x",
        )}
      >
        {doubled.map((src, i) => (
          <div
            key={i}
            className={cn(
              "shrink-0 w-64 rounded-2xl overflow-hidden border-gold shadow-elegant",
              height,
            )}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <style>{`.mask-fade{mask-image:linear-gradient(to right,transparent,black 8%,black 92%,transparent);}`}</style>
    </div>
  );
}