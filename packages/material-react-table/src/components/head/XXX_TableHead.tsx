import type React from "react";
import { cn } from "@/lib/utils";
import { MRT_TableHeadRow } from "./MRT_TableHeadRow";
import { TableHeader } from "../ui/table";
import type {
	MRT_ColumnVirtualizer,
	MRT_RowData,
	MRT_TableInstance,
} from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { MRT_ToolbarAlertBanner } from "../toolbar/MRT_ToolbarAlertBanner";

export interface XXX_TableHeadProps<TData extends MRT_RowData>
	extends React.ComponentProps<"thead"> {
	columnVirtualizer?: MRT_ColumnVirtualizer;
	table: MRT_TableInstance<TData>;
}

export const XXX_TableHead = <TData extends MRT_RowData>({
	columnVirtualizer,
	table,
	...rest
}: XXX_TableHeadProps<TData>) => {
	const {
		getState,
		options: {
			enableStickyHeader,
			layoutMode,
			muiTableHeadProps,
			positionToolbarAlertBanner,
		},
		refs: { tableHeadRef },
	} = table;
	const { isFullScreen, showAlertBanner } = getState();

	const tableHeadProps = {
		...parseFromValuesOrFunc(muiTableHeadProps, { table }),
		...rest,
	};

	const stickyHeader = enableStickyHeader || isFullScreen;

	return (
		<TableHeader
			{...tableHeadProps}
			ref={(ref: HTMLTableSectionElement) => {
				tableHeadRef.current = ref;
				if (tableHeadProps?.ref) {
					tableHeadProps.ref.current = ref;
				}
			}}
			className={cn(
				"opacity-97",
				layoutMode?.startsWith("grid") && "grid",
				stickyHeader && "sticky top-0 z-[2]",
				tableHeadProps?.className,
			)}
		>
			{positionToolbarAlertBanner === "head-overlay" &&
			(showAlertBanner || table.getSelectedRowModel().rows.length > 0) ? (
				<TableRow
					className={cn(
						layoutMode?.startsWith("grid") && "grid",
						"w-full [&>th]:p-0",
					)}
				>
					<TableHead
						colSpan={table.getVisibleLeafColumns().length}
						className={cn(layoutMode?.startsWith("grid") && "grid")}
					>
						<MRT_ToolbarAlertBanner table={table} />
					</TableHead>
				</TableRow>
			) : (
				table
					.getHeaderGroups()
					.map((headerGroup) => (
						<MRT_TableHeadRow
							columnVirtualizer={columnVirtualizer}
							headerGroup={headerGroup}
							key={headerGroup.id}
							table={table}
						/>
					))
			)}
		</TableHeader>
	);
};
