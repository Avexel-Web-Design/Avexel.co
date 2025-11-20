import React, { useMemo } from "react";

/**
 * Monogram Component
 * Creates a stylized monogram placeholder for profiles when photos aren't available
 *
 * @param {Object} props
 * @param {string} props.name - Full name of the person to generate initials from
 * @param {string} props.className - Additional classes to apply
 * @param {string} props.size - Size of the monogram (lg, md, sm)
 */
const Monogram = ({
  name,
  className = "",
  size = "md",
}) => {
  // Get the initials from the name
  const initials = useMemo(() => {
    if (!name) return "??";

    // Get first character of each word and uppercase it
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2) // Limit to max 2 characters
      .join("");
  }, [name]);

  // Determine size classes
  const sizeClasses = useMemo(() => {
    switch (size) {
      case "lg":
        return "w-32 h-32 text-4xl";
      case "sm":
        return "w-10 h-10 text-sm";
      case "xs":
        return "w-8 h-8 text-xs";
      case "md":
      default:
        return "w-16 h-16 text-xl";
    }
  }, [size]);

  return (
    <div
      className={`relative rounded-full overflow-hidden ${sizeClasses} ${className} group`}
      aria-label={`Monogram for ${name}`}
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple to-neon-blue opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 mix-blend-overlay"></div>

      {/* Shimmering overlay effect */}
      <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>

      {/* Glowing animated ring */}
      <div className="absolute inset-0 border border-white/20 rounded-full"></div>

      {/* Initials text */}
      <div className="absolute inset-0 flex items-center justify-center font-bold text-white font-outfit tracking-wider">
        {initials}
      </div>
    </div>
  );
};

export default Monogram;
