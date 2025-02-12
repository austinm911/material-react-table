import type React from "react";
import { cn } from "@/lib/utils";
import { TableRow } from "../ui/table";
import type {
	MRT_ColumnVirtualizer,
	MRT_Header,
	MRT_HeaderGroup,
	MRT_RowData,
	MRT_TableInstance,
	MRT_VirtualItem,
} from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { SRT_TableHeadCell } from "./SRT_TableHeadCell";

export interface SRT_TableHeadRowProps<TData extends MRT_RowData>
	extends React.ComponentProps<"tr"> {
	columnVirtualizer?: MRT_ColumnVirtualizer;
	headerGroup: MRT_HeaderGroup<TData>;
	table: MRT_TableInstance<TData>;
}

export const SRT_TableHeadRow = <TData extends MRT_RowData>({
	columnVirtualizer,
	headerGroup,
	table,
	...rest
}: SRT_TableHeadRowProps<TData>) => {
	const {
		options: {
			enableStickyHeader,
			layoutMode,
			mrtTheme: { baseBackgroundColor },
			muiTableHeadRowProps,
		},
	} = table;

	const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
		columnVirtualizer ?? {};

	// Merge custom props passed via table config with any additional overrides
	const resolvedProps = {
		...parseFromValuesOrFunc(muiTableHeadRowProps, { headerGroup, table }),
		...rest,
	};

	return (
		<TableRow
			{...resolvedProps}
			className={cn(
				resolvedProps.className,
				"shadow-md",
				layoutMode?.startsWith("grid") && "flex",
				enableStickyHeader && layoutMode === "semantic"
					? "sticky top-0"
					: "relative",
			)}
			style={{
				backgroundColor: baseBackgroundColor,
				...(resolvedProps.style || {}),
			}}
		>
			{virtualPaddingLeft ? (
				<th className="flex" style={{ width: virtualPaddingLeft }} />
			) : null}
			{(virtualColumns ?? headerGroup.headers).map(
				(headerOrVirtualHeader, index) => {
					// Handle virtualization without reassigning parameters
					const currentHeader = columnVirtualizer
						? headerGroup.headers[
								(headerOrVirtualHeader as MRT_VirtualItem).index
							]
						: (headerOrVirtualHeader as MRT_Header<TData>);

					return currentHeader ? (
						<SRT_TableHeadCell
							columnVirtualizer={columnVirtualizer}
							header={currentHeader}
							key={currentHeader.id}
							staticColumnIndex={
								columnVirtualizer
									? (headerOrVirtualHeader as MRT_VirtualItem).index
									: index
							}
							table={table}
						/>
					) : null;
				},
			)}
			{virtualPaddingRight ? (
				<th className="flex" style={{ width: virtualPaddingRight }} />
			) : null}
		</TableRow>
	);
};
