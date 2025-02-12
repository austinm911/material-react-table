import type { DragEvent, RefObject } from "react";
import type { MRT_Column, MRT_RowData, MRT_TableInstance } from "../../types";
import { reorderColumn } from "../../utils/column.utils";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { XXX_GrabHandleButton } from "../buttons/XXX_GrabHandleButton";

export interface MRT_TableHeadCellGrabHandleProps<TData extends MRT_RowData>
	extends React.ComponentProps<"button"> {
	column: MRT_Column<TData>;
	table: MRT_TableInstance<TData>;
	tableHeadCellRef: RefObject<HTMLTableCellElement | null>;
}

export const XXX_TableHeadCellGrabHandle = <TData extends MRT_RowData>({
	column,
	table,
	tableHeadCellRef,
	...rest
}: MRT_TableHeadCellGrabHandleProps<TData>) => {
	const {
		getState,
		options: { enableColumnOrdering, muiColumnDragHandleProps },
		setColumnOrder,
		setDraggingColumn,
		setHoveredColumn,
	} = table;
	const { columnDef } = column;
	const { columnOrder, draggingColumn, hoveredColumn } = getState();

	// Merge props from table options and column definition
	const buttonProps = {
		...parseFromValuesOrFunc(muiColumnDragHandleProps, { column, table }),
		...parseFromValuesOrFunc(columnDef.muiColumnDragHandleProps, {
			column,
			table,
		}),
		...rest,
	};

	const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
		buttonProps?.onDragStart?.(event);
		setDraggingColumn(column);
		try {
			event.dataTransfer.setDragImage(
				tableHeadCellRef.current as HTMLElement,
				0,
				0,
			);
		} catch (e) {
			console.error(e);
		}
	};

	const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
		buttonProps?.onDragEnd?.(event);
		if (hoveredColumn?.id === "drop-zone") {
			column.toggleGrouping();
		} else if (
			enableColumnOrdering &&
			hoveredColumn &&
			hoveredColumn?.id !== draggingColumn?.id
		) {
			setColumnOrder(
				reorderColumn(column, hoveredColumn as MRT_Column<TData>, columnOrder),
			);
		}
		setDraggingColumn(null);
		setHoveredColumn(null);
	};

	return (
		<XXX_GrabHandleButton
			{...buttonProps}
			location="column"
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			table={table}
		/>
	);
};
