import type { DragEvent } from 'react'
import type { ButtonProps, SRT_Row, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_GrabHandleButton } from '../buttons/SRT_GrabHandleButton'

// Duplicate of MRT_TableBodyRowGrabHandle with SRT_ prefix
export interface SRT_TableBodyRowGrabHandleProps<TData extends SRT_RowData> extends ButtonProps {
	row: SRT_Row<TData>
	rowRef: React.RefObject<HTMLTableRowElement | null>
	table: SRT_TableInstance<TData>
}

export const SRT_TableBodyRowGrabHandle = <TData extends SRT_RowData>({
	row,
	rowRef,
	table,
	...rest
}: SRT_TableBodyRowGrabHandleProps<TData>) => {
	const {
		options: { shadcnRowDragHandleProps },
	} = table
	const iconButtonProps = {
		...parseFromValuesOrFunc(shadcnRowDragHandleProps, { row, table }),
		...rest,
	}

	const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps.onDragStart?.(event)
		try {
			event.dataTransfer.setDragImage(rowRef.current as HTMLElement, 0, 0)
		} catch (error) {
			console.error(error)
		}
		table.setDraggingRow(row)
	}

	const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps.onDragEnd?.(event)
		table.setDraggingRow(null)
		table.setHoveredRow(null)
	}

	return (
		<SRT_GrabHandleButton
			{...iconButtonProps}
			location="row"
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			table={table}
		/>
	)
}
