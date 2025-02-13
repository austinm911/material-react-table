import type * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, SeparatorHorizontalIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "./separator";

function Checkbox({
	className,
	indeterminate,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
	indeterminate?: boolean | "indeterminate";
}) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"peer border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-4 shrink-0 rounded-[4px] border shadow-xs transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-0",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="flex items-center justify-center text-current"
			>
				{indeterminate === "indeterminate" && (
					<SeparatorHorizontalIcon className="size-3.5" />
				)}
				{indeterminate === true && <CheckIcon className="size-3.5" />}
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
