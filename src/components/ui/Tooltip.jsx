import React from "react";

export const Tooltip = ({ content, children, enabled = true, position = "top" }) => {
  if (!enabled || !content) return <>{children}</>;

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  const arrows = {
    top: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900",
    bottom: "absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-zinc-900",
    left: "absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-zinc-900",
    right: "absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-zinc-900"
  };

  const currentPos = positions[position] || positions.top;
  const currentArrow = arrows[position] || arrows.top;

  return (
    <div className="relative group inline-block">
      {children}
      <div className={`pointer-events-none absolute ${currentPos} scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 bg-zinc-900 text-[11px] font-semibold tracking-wide text-zinc-200 px-2 py-1.5 rounded-md border border-zinc-800 shadow-xl z-50 text-center w-max max-w-[200px]`}>
        {content}
        <div className={currentArrow}></div>
      </div>
    </div>
  );
};

export default Tooltip;
