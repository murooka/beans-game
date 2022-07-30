import clsx from "clsx";
import type { ComponentProps } from "react";

type SystemButtonProps = ComponentProps<"button">;
export const SystemButton = ({
  children,
  className,
  ...rest
}: SystemButtonProps) => {
  return (
    <button
      className={clsx("border rounded px-4 py-2 hover:bg-gray-200", className)}
      {...rest}
    >
      {children}
    </button>
  );
};
