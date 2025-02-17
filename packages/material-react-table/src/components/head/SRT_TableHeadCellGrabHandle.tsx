import type { DragEvent, RefObject } from 'react'
import type { ButtonProps, SRT_Column, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { reorderColumn } from '../../utils/column.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_GrabHandleButton } from '../buttons/SRT_GrabHandleButton'

export interface SRT_TableHeadCellGrabHandleProps<TData extends SRT_RowData> extends ButtonProps {
	column: SRT_Column<TData>
	table: SRT_TableInstance<TData>
	tableHeadCellRef: RefObject<HTMLTableCellElement | null>
}

export const SRT_TableHeadCellGrabHandle = <TData extends SRT_RowData>({
	column,
	table,
	tableHeadCellRef,
	...rest
}: SRT_TableHeadCellGrabHandleProps<TData>) => {
	const {
		getState,
		options: { enableColumnOrdering, shadcnColumnDragHandleProps },
		setColumnOrder,
		setDraggingColumn,
		setHoveredColumn,
	} = table
	const { columnDef } = column
	const { columnOrder, draggingColumn, hoveredColumn } = getState()

	// Merge props from table options and column definition
	const buttonProps = {
		...parseFromValuesOrFunc(shadcnColumnDragHandleProps, { column, table }),
		...parseFromValuesOrFunc(columnDef.shadcnColumnDragHandleProps, {
			column,
			table,
		}),
		...rest,
	}

	const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
		buttonProps?.onDragStart?.(event)
		setDraggingColumn(column)
		try {
			event.dataTransfer.setDragImage(tableHeadCellRef.current as HTMLElement, 0, 0)
		} catch (e) {
			console.error(e)
		}
	}

	const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
		buttonProps?.onDragEnd?.(event)
		if (hoveredColumn?.id === 'drop-zone') {
			column.toggleGrouping()
		} else if (enableColumnOrdering && hoveredColumn && hoveredColumn?.id !== draggingColumn?.id) {
			setColumnOrder(reorderColumn(column, hoveredColumn as SRT_Column<TData>, columnOrder))
		}
		setDraggingColumn(null)
		setHoveredColumn(null)
	}

	return (
		<SRT_GrabHandleButton
			{...buttonProps}
			location="column"
			onDragEnd={handleDragEnd}
			onDragStart={handleDragStart}
			table={table}
		/>
	)
}
