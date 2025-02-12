import { type DragEvent, useMemo } from "react";
import { cn } from "@/lib/utils";
import { TableHead } from "../ui/table";
import { MRT_TableHeadCellColumnActionsButton } from "./MRT_TableHeadCellColumnActionsButton";
import { MRT_TableHeadCellFilterContainer } from "./MRT_TableHeadCellFilterContainer";
import { MRT_TableHeadCellFilterLabel } from "./MRT_TableHeadCellFilterLabel";
import { MRT_TableHeadCellGrabHandle } from "./MRT_TableHeadCellGrabHandle";
import { MRT_TableHeadCellResizeHandle } from "./MRT_TableHeadCellResizeHandle";
import { MRT_TableHeadCellSortLabel } from "./MRT_TableHeadCellSortLabel";
import type {
	MRT_ColumnVirtualizer,
	MRT_Header,
	MRT_RowData,
	MRT_TableInstance,
} from "../../types";
import { getCommonMRTCellStyles } from "../../utils/style.utils";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { cellKeyboardShortcuts } from "../../utils/cell.utils";

export interface XXX_TableHeadCellProps<TData extends MRT_RowData>
	extends React.ComponentProps<"th"> {
	columnVirtualizer?: MRT_ColumnVirtualizer;
	header: MRT_Header<TData>;
	staticColumnIndex?: number;
	table: MRT_TableInstance<TData>;
}

export const XXX_TableHeadCell = <TData extends MRT_RowData>({
	columnVirtualizer,
	header,
	staticColumnIndex,
	table,
	...rest
}: XXX_TableHeadCellProps<TData>) => {
	// const theme = useTheme();
	const {
		getState,
		options: {
			columnFilterDisplayMode,
			columnResizeDirection,
			columnResizeMode,
			enableKeyboardShortcuts,
			enableColumnActions,
			enableColumnDragging,
			enableColumnOrdering,
			enableColumnPinning,
			enableGrouping,
			enableMultiSort,
			layoutMode,
			mrtTheme: { draggingBorderColor },
			muiTableHeadCellProps,
		},
		refs: { tableHeadCellRefs },
		setHoveredColumn,
	} = table;
	const {
		columnSizingInfo,
		density,
		draggingColumn,
		grouping,
		hoveredColumn,
		showColumnFilters,
	} = getState();
	const { column } = header;
	const { columnDef } = column;
	const { columnDefType } = columnDef;

	const tableCellProps = {
		...parseFromValuesOrFunc(muiTableHeadCellProps, { column, table }),
		...parseFromValuesOrFunc(columnDef.muiTableHeadCellProps, {
			column,
			table,
		}),
		...rest,
	};

	const isColumnPinned =
		enableColumnPinning &&
		columnDef.columnDefType !== "group" &&
		column.getIsPinned();

	const showColumnActions =
		(enableColumnActions || columnDef.enableColumnActions) &&
		columnDef.enableColumnActions !== false;

	const showDragHandle =
		enableColumnDragging !== false &&
		columnDef.enableColumnDragging !== false &&
		(enableColumnDragging ||
			(enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
			(enableGrouping &&
				columnDef.enableGrouping !== false &&
				!grouping.includes(column.id)));

	const headerPL = useMemo(() => {
		let pl = 0;
		if (column.getCanSort()) pl += 1;
		if (showColumnActions) pl += 1.75;
		if (showDragHandle) pl += 1.5;
		return pl;
	}, [showColumnActions, showDragHandle]);

	const draggingBorders = useMemo(() => {
		const showResizeBorder =
			columnSizingInfo.isResizingColumn === column.id &&
			columnResizeMode === "onChange" &&
			!header.subHeaders.length;

		const borderStyle = showResizeBorder
			? "2px solid var(--mrt-dragging-border-color)"
			: draggingColumn?.id === column.id
				? "1px dashed hsl(var(--muted-foreground))"
				: hoveredColumn?.id === column.id
					? "2px dashed var(--mrt-dragging-border-color)"
					: undefined;

		if (showResizeBorder) {
			return columnResizeDirection === "ltr"
				? { borderRight: borderStyle }
				: { borderLeft: borderStyle };
		}
		return borderStyle
			? {
					borderLeft: borderStyle,
					borderRight: borderStyle,
					borderTop: borderStyle,
				}
			: undefined;
	}, [draggingColumn, hoveredColumn, columnSizingInfo.isResizingColumn]);

	const handleDragEnter = (_e: DragEvent) => {
		if (enableGrouping && hoveredColumn?.id === "drop-zone") {
			setHoveredColumn(null);
		}
		if (enableColumnOrdering && draggingColumn && columnDefType !== "group") {
			setHoveredColumn(
				columnDef.enableColumnOrdering !== false ? column : null,
			);
		}
	};

	const handleDragOver = (e: DragEvent) => {
		if (columnDef.enableColumnOrdering !== false) {
			e.preventDefault();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
		tableCellProps?.onKeyDown?.(e);
		cellKeyboardShortcuts({
			event: e,
			cellValue: header.column.columnDef.header,
			table,
			header,
		});
	};

	const HeaderElement =
		parseFromValuesOrFunc(columnDef.Header, {
			column,
			header,
			table,
		}) ?? columnDef.header;

	return (
		<TableHead
			align={
				columnDefType === "group"
					? "center"
					: column.columnDef.headerAlign?.(
							header.getContext(),
						) /* RTL handled by CSS */
			}
			aria-sort={
				column.getIsSorted()
					? column.getIsSorted() === "asc"
						? "ascending"
						: "descending"
					: undefined
			}
			colSpan={header.colSpan}
			data-can-sort={column.getCanSort() || undefined}
			data-index={staticColumnIndex}
			data-pinned={!!isColumnPinned || undefined}
			data-sort={column.getIsSorted() || undefined}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			ref={(node: HTMLTableCellElement) => {
				if (node) {
					tableHeadCellRefs.current[column.id] = node;
					if (columnDefType !== "group") {
						columnVirtualizer?.measureElement?.(node);
					}
				}
			}}
			tabIndex={enableKeyboardShortcuts ? 0 : undefined}
			{...tableCellProps}
			className={cn(
				"group/head align-top",
				layoutMode?.startsWith("grid") ? "flex-col" : "flex",
				enableMultiSort && column.getCanSort() && "select-none",
				density === "compact"
					? "p-2"
					: density === "comfortable"
						? columnDefType === "display"
							? "p-3"
							: "p-4"
						: "p-6",
				tableCellProps?.className,
			)}
			onKeyDown={handleKeyDown}
			style={{
				...draggingBorders,
				...tableCellProps?.style,
			}}
		>
			{header.isPlaceholder ? null : (
				<div className="flex w-full items-center justify-between gap-2">
					<div
						className={cn(
							"flex items-center gap-1",
							column.getCanSort() &&
								columnDefType !== "group" &&
								"cursor-pointer",
							columnDefType === "data" && "min-w-[4ch]",
						)}
						onClick={column.getToggleSortingHandler()}
					>
						<span className="truncate font-medium">{HeaderElement}</span>
						{column.getCanFilter() && (
							<MRT_TableHeadCellFilterLabel header={header} table={table} />
						)}
						{column.getCanSort() && (
							<MRT_TableHeadCellSortLabel header={header} table={table} />
						)}
					</div>

					<div className="flex items-center gap-1">
						{columnDefType !== "group" && (
							<>
								{showDragHandle && (
									<MRT_TableHeadCellGrabHandle
										column={column}
										table={table}
										tableHeadCellRef={{
											current: tableHeadCellRefs.current?.[column.id]!,
										}}
									/>
								)}
								{showColumnActions && (
									<MRT_TableHeadCellColumnActionsButton
										header={header}
										table={table}
									/>
								)}
							</>
						)}
						{column.getCanResize() && (
							<MRT_TableHeadCellResizeHandle header={header} table={table} />
						)}
					</div>
				</div>
			)}
			{columnFilterDisplayMode === "subheader" && column.getCanFilter() && (
				<MRT_TableHeadCellFilterContainer header={header} table={table} />
			)}
		</TableHead>
	);
};
