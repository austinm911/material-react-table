import type { RefObject } from "react";
import Collapse from "@mui/material/Collapse";
import TableCell, { type TableCellProps } from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import type {
	MRT_Row,
	MRT_RowData,
	MRT_RowVirtualizer,
	MRT_TableInstance,
	MRT_VirtualItem,
} from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";

// Duplicate of MRT_TableDetailPanel with SRT_ prefix
export interface SRT_TableDetailPanelProps<TData extends MRT_RowData>
	extends TableCellProps {
	parentRowRef: RefObject<HTMLTableRowElement | null>;
	row: MRT_Row<TData>;
	rowVirtualizer?: MRT_RowVirtualizer;
	staticRowIndex: number;
	table: MRT_TableInstance<TData>;
	virtualRow?: MRT_VirtualItem;
}

export const SRT_TableDetailPanel = <TData extends MRT_RowData>({
	parentRowRef,
	row,
	rowVirtualizer,
	staticRowIndex,
	table,
	virtualRow,
	...rest
}: SRT_TableDetailPanelProps<TData>) => {
	const {
		getVisibleLeafColumns,
		options: {
			layoutMode,
			mrtTheme: { baseBackgroundColor },
			muiDetailPanelProps,
			muiTableBodyRowProps,
			renderDetailPanel,
		},
	} = table;
	const tableRowProps = parseFromValuesOrFunc(muiTableBodyRowProps, {
		isDetailPanel: true,
		row,
		staticRowIndex,
		table,
	});
	const tableCellProps = {
		...parseFromValuesOrFunc(muiDetailPanelProps, { row, table }),
		...rest,
	};

	const DetailPanel =
		!table.getState().isLoading && renderDetailPanel?.({ row, table });

	return (
		<TableRow
			{...tableRowProps}
			sx={(theme) => ({
				display: layoutMode?.startsWith("grid") ? "flex" : undefined,
				position: virtualRow ? "absolute" : undefined,
				top: virtualRow
					? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
					: undefined,
				transform: virtualRow ? `translateY(${virtualRow.start}px)` : undefined,
				width: "100%",
				...(parseFromValuesOrFunc(tableRowProps?.sx, theme) as any),
			})}
		>
			<TableCell
				colSpan={getVisibleLeafColumns().length}
				{...tableCellProps}
				sx={(theme) => ({
					backgroundColor: virtualRow ? baseBackgroundColor : undefined,
					borderBottom: !row.getIsExpanded() ? "none" : undefined,
					display: layoutMode?.startsWith("grid") ? "flex" : undefined,
					py: !!DetailPanel && row.getIsExpanded() ? "1rem" : 0,
					transition: !virtualRow ? "all 150ms ease-in-out" : undefined,
					width: "100%",
					...(parseFromValuesOrFunc(tableCellProps?.sx, theme) as any),
				})}
			>
				{virtualRow ? (
					row.getIsExpanded() && DetailPanel
				) : (
					<Collapse in={row.getIsExpanded()} mountOnEnter unmountOnExit>
						{DetailPanel}
					</Collapse>
				)}
			</TableCell>
		</TableRow>
	);
};
