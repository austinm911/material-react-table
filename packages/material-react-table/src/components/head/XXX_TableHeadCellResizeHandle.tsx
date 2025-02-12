import type React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from "../../types";

export interface XXX_TableHeadCellResizeHandleProps<TData extends MRT_RowData>
	extends React.ComponentProps<"div"> {
	header: MRT_Header<TData>;
	table: MRT_TableInstance<TData>;
}

export const XXX_TableHeadCellResizeHandle = <TData extends MRT_RowData>({
	header,
	table,
	className,
	...rest
}: XXX_TableHeadCellResizeHandleProps<TData>) => {
	const {
		getState,
		options: { columnResizeDirection, columnResizeMode },
		setColumnSizingInfo,
	} = table;
	const { density } = getState();
	const { column } = header;

	const handler = header.getResizeHandler();

	const marginX =
		density === "compact"
			? "-8px"
			: density === "comfortable"
				? "-16px"
				: "-24px";

	const edgePosition =
		column.columnDef.columnDefType === "display" ? "4px" : "0";

	return (
		<div
			className={cn(
				"absolute cursor-col-resize px-1",
				columnResizeDirection === "rtl"
					? "left-[var(--edge-position)]"
					: "right-[var(--edge-position)]",
				columnResizeDirection === "rtl"
					? "ml-[var(--margin-x)]"
					: "mr-[var(--margin-x)]",
				className,
			)}
			onDoubleClick={() => {
				setColumnSizingInfo((old) => ({
					...old,
					isResizingColumn: false,
				}));
				column.resetSize();
			}}
			onMouseDown={handler}
			onTouchStart={handler}
			style={{
				["--edge-position" as string]: edgePosition,
				["--margin-x" as string]: marginX,
				transform:
					column.getIsResizing() && columnResizeMode === "onEnd"
						? `translateX(${
								(columnResizeDirection === "rtl" ? -1 : 1) *
								(getState().columnSizingInfo.deltaOffset ?? 0)
							}px)`
						: undefined,
			}}
			{...rest}
		>
			<Separator
				className={cn(
					"h-6 w-0.5 translate-x-1 rounded-full border-none bg-border transition-colors duration-150 ease-in-out data-[state=active]:bg-primary group-hover:bg-primary/50",
					{
						"opacity-0":
							header.subHeaders.length || columnResizeMode === "onEnd",
						"opacity-100": column.getIsResizing(),
					},
				)}
				orientation="vertical"
			/>
		</div>
	);
};
