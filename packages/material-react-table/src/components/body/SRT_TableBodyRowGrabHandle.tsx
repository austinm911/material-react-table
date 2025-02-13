import type { DragEvent } from "react";
import type { IconButtonProps } from "@mui/material/IconButton";
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { SRT_GrabHandleButton } from "../buttons/SRT_GrabHandleButton";

// Duplicate of MRT_TableBodyRowGrabHandle with SRT_ prefix
export interface SRT_TableBodyRowGrabHandleProps<TData extends MRT_RowData>
	extends IconButtonProps {
	row: MRT_Row<TData>;
	rowRef: React.RefObject<HTMLTableRowElement | null>;
	table: MRT_TableInstance<TData>;
}

export const SRT_TableBodyRowGrabHandle = <TData extends MRT_RowData>({
	row,
	rowRef,
	table,
	...rest
}: SRT_TableBodyRowGrabHandleProps<TData>) => {
	const {
		options: { muiRowDragHandleProps },
	} = table;
	const iconButtonProps = {
		...parseFromValuesOrFunc(muiRowDragHandleProps, { row, table }),
		...rest,
	};

	const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps.onDragStart?.(event);
		try {
			event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0);
		} catch (error) {
			console.error(error);
		}
		table.setDraggingRow(row);
	};

	const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps.onDragEnd?.(event);
		table.setDraggingRow(null);
		table.setHoveredRow(null);
	};

	return (
		<SRT_GrabHandleButton
			{...iconButtonProps}
			location="row"
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			table={table}
		/>
	);
};
