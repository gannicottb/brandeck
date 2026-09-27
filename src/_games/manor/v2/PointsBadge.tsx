import iconFor from "./icons";

export const PointsBadge = ({
  color,
  points,
}: {
  color: string;
  points: string;
}) => {
  return (
    <div
      className={`bg-white border-2 rounded-tl px-1 italic border-${color}`}
    >
      +{points} {iconFor("point")}
    </div>
  );
};
