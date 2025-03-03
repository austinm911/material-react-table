import { type DragEvent, type MouseEvent, type RefObject, memo, useEffect, useMemo, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import { TableCell } from '../ui/table'
import { cn } from '../../lib/utils'

import { SRT_TableBodyCellValue } from './SRT_TableBodyCellValue'
import type { SRT_Cell, SRT_RowData, SRT_TableInstance, TableCellProps } from '../../types-SRT'
import { isCellEditable, cellKeyboardShortcuts, openEditingCell } from '../../utils/cell.utils.shadcn'
import { getCommonSRTCellStyles } from '../../utils/style.utils.shadcn'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_CopyButton } from '../buttons/SRT_CopyButton'
import { SRT_EditCellTextField } from '../inputs/SRT_EditCellTextField'

export interface SRT_TableBodyCellProps<TData extends SRT_RowData> extends TableCellProps {
	cell: SRT_Cell<TData>
	numRows?: number
	rowRef: RefObject<HTMLTableRowElement | null>
	staticColumnIndex?: number
	staticRowIndex: number
	table: SRT_TableInstance<TData>
}

export const SRT_TableBodyCell = <TData extends SRT_RowData>({
	cell,
	numRows,
	rowRef,
	staticColumnIndex,
	staticRowIndex,
	table,
	...rest
}: SRT_TableBodyCellProps<TData>) => {
	const {
		getState,
		options: {
			columnResizeDirection,
			columnResizeMode,
			createDisplayMode,
			editDisplayMode,
			enableCellActions,
			enableClickToCopy,
			enableColumnOrdering,
			enableColumnPinning,
			enableGrouping,
			enableKeyboardShortcuts,
			layoutMode,
			shadcnTheme: { draggingBorderColor },
			shadcnSkeletonProps,
			shadcnTableBodyCellProps,
		},
		setHoveredColumn,
	} = table
	const {
		actionCell,
		columnSizingInfo,
		creatingRow,
		density,
		draggingColumn,
		draggingRow,
		editingCell,
		editingRow,
		hoveredColumn,
		hoveredRow,
		isLoading,
		showSkeletons,
	} = getState()
	const { column, row } = cell
	const { columnDef } = column
	const { columnDefType } = columnDef

	const args = { cell, column, row, table }
	const tableCellProps = {
		...parseFromValuesOrFunc(shadcnTableBodyCellProps, args),
		...parseFromValuesOrFunc(columnDef.shadcnTableBodyCellProps, args),
		...rest,
	}

	const skeletonProps = parseFromValuesOrFunc(shadcnSkeletonProps, {
		cell,
		column,
		row,
		table,
	})

	const [skeletonWidth, setSkeletonWidth] = useState(100)
	useEffect(() => {
		if ((!isLoading && !showSkeletons) || skeletonWidth !== 100) return
		const size = column.getSize()
		setSkeletonWidth(
			columnDefType === 'display' ? size / 2 : Math.round(Math.random() * (size - size / 3) + size / 3),
		)
	}, [isLoading, showSkeletons])

	const draggingBorders = useMemo(() => {
		const isDraggingColumn = draggingColumn?.id === column.id
		const isHoveredColumn = hoveredColumn?.id === column.id
		const isDraggingRow = draggingRow?.id === row.id
		const isHoveredRow = hoveredRow?.id === row.id
		const isFirstColumn = column.getIsFirstColumn()
		const isLastColumn = column.getIsLastColumn()
		const isLastRow = numRows && staticRowIndex === numRows - 1
		const isResizingColumn = columnSizingInfo.isResizingColumn === column.id
		const showResizeBorder = isResizingColumn && columnResizeMode === 'onChange'

		const borderStyle = showResizeBorder
			? `2px solid ${draggingBorderColor} !important`
			: isDraggingColumn || isDraggingRow
				? '1px dashed gray !important'
				: isHoveredColumn || isHoveredRow || isResizingColumn
					? `2px dashed ${draggingBorderColor} !important`
					: undefined

		if (showResizeBorder) {
			return columnResizeDirection === 'ltr' ? { borderRight: borderStyle } : { borderLeft: borderStyle }
		}

		return borderStyle
			? {
					borderBottom:
						isDraggingRow || isHoveredRow || (isLastRow && !isResizingColumn) ? borderStyle : undefined,
					borderLeft:
						isDraggingColumn || isHoveredColumn || ((isDraggingRow || isHoveredRow) && isFirstColumn)
							? borderStyle
							: undefined,
					borderRight:
						isDraggingColumn || isHoveredColumn || ((isDraggingRow || isHoveredRow) && isLastColumn)
							? borderStyle
							: undefined,
					borderTop: isDraggingRow || isHoveredRow ? borderStyle : undefined,
				}
			: undefined
	}, [columnSizingInfo.isResizingColumn, draggingColumn, draggingRow, hoveredColumn, hoveredRow, staticRowIndex])

	const isColumnPinned = enableColumnPinning && columnDef.columnDefType !== 'group' && column.getIsPinned()

	const isEditable = isCellEditable({ cell, table })

	const isEditing =
		isEditable &&
		!['custom', 'modal'].includes(editDisplayMode as string) &&
		(editDisplayMode === 'table' || editingRow?.id === row.id || editingCell?.id === cell.id) &&
		!row.getIsGrouped()

	const isCreating = isEditable && createDisplayMode === 'row' && creatingRow?.id === row.id

	const showClickToCopyButton =
		(parseFromValuesOrFunc(enableClickToCopy, cell) === true ||
			parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === true) &&
		!['context-menu', false].includes(
			// @ts-expect-error
			parseFromValuesOrFunc(columnDef.enableClickToCopy, cell),
		)

	const isRightClickable = parseFromValuesOrFunc(enableCellActions, cell)

	const cellValueProps = {
		cell,
		table,
		staticColumnIndex,
		staticRowIndex,
	}

	const handleDoubleClick = (event: MouseEvent<HTMLTableCellElement>) => {
		tableCellProps?.onDoubleClick?.(event)
		openEditingCell({ cell, table })
	}

	const handleDragEnter = (e: DragEvent<HTMLTableCellElement>) => {
		tableCellProps?.onDragEnter?.(e)
		if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
			setHoveredColumn(null)
		}
		if (enableColumnOrdering && draggingColumn) {
			setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
		}
	}

	const handleDragOver = (e: DragEvent) => {
		if (columnDef.enableColumnOrdering !== false) {
			e.preventDefault()
		}
	}

	const handleContextMenu = (e: MouseEvent<HTMLTableCellElement>) => {
		tableCellProps?.onContextMenu?.(e)
		if (isRightClickable) {
			e.preventDefault()
			table.setActionCell(cell)
			table.refs.actionCellRef.current = e.currentTarget
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
		tableCellProps?.onKeyDown?.(event)
		cellKeyboardShortcuts({
			cell,
			cellValue: cell.getValue<string>(),
			event,
			table,
		})
	}

	// Calculate cell styles based on various conditions
	const getCellStyles = () => {
		const baseStyles = {
			alignItems: layoutMode?.startsWith('grid') ? 'center' : undefined,
			cursor: isRightClickable
				? 'context-menu'
				: isEditable && editDisplayMode === 'cell'
					? 'pointer'
					: 'inherit',
			outline: actionCell?.id === cell.id ? '1px solid gray' : undefined,
			outlineOffset: '-1px',
			overflow: 'hidden',
			padding:
				density === 'compact'
					? columnDefType === 'display'
						? '0 0.5rem'
						: '0.5rem'
					: density === 'comfortable'
						? columnDefType === 'display'
							? '0.5rem 0.75rem'
							: '1rem'
						: columnDefType === 'display'
							? '1rem 1.25rem'
							: '1.5rem',
			textOverflow: columnDefType !== 'display' ? 'ellipsis' : undefined,
			whiteSpace: row.getIsPinned() || density === 'compact' ? 'nowrap' : 'normal',
		}

		// Merge with common cell styles and dragging borders
		return {
			...baseStyles,
			...getCommonSRTCellStyles({
				column,
				table,
				tableCellProps,
				theme: {} as any,
			}),
			...draggingBorders,
		}
	}

	// Generate hover styles
	const getHoverStyles = () => {
		return {
			outline:
				actionCell?.id === cell.id ||
				(editDisplayMode === 'cell' && isEditable) ||
				(editDisplayMode === 'table' && (isCreating || isEditing))
					? '1px solid gray'
					: undefined,
			textOverflow: 'clip',
		}
	}

	return (
		<TableCell
			data-index={staticColumnIndex}
			data-pinned={!!isColumnPinned || undefined}
			tabIndex={enableKeyboardShortcuts ? 0 : undefined}
			{...tableCellProps}
			onKeyDown={handleKeyDown}
			onContextMenu={handleContextMenu}
			onDoubleClick={handleDoubleClick}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			className={cn(
				// Base styles
				'relative',
				// Apply hover styles via CSS instead of inline styles
				'hover:text-overflow-clip',
				// Add conditional classes based on state
				{
					'hover:outline hover:outline-1 hover:outline-gray-500':
						actionCell?.id === cell.id ||
						(editDisplayMode === 'cell' && isEditable) ||
						(editDisplayMode === 'table' && (isCreating || isEditing)),
					'outline outline-1 outline-gray-500': actionCell?.id === cell.id,
				},
				tableCellProps.className,
			)}
			style={getCellStyles()}
		>
			{tableCellProps.children ?? (
				<>
					{cell.getIsPlaceholder() ? (
						(columnDef.PlaceholderCell?.({ cell, column, row, table }) ?? null)
					) : showSkeletons !== false && (isLoading || showSkeletons) ? (
						<Skeleton
							className={cn('h-5', skeletonProps?.className)}
							style={{ width: `${skeletonWidth}px` }}
							{...skeletonProps}
						/>
					) : columnDefType === 'display' &&
						(['mrt-row-expand', 'mrt-row-numbers', 'mrt-row-select'].includes(column.id) ||
							!row.getIsGrouped()) ? (
						columnDef.Cell?.({
							cell,
							column,
							renderedCellValue: cell.renderValue() as any,
							row,
							rowRef,
							staticColumnIndex,
							staticRowIndex,
							table,
						})
					) : isCreating || isEditing ? (
						<SRT_EditCellTextField cell={cell} table={table} />
					) : showClickToCopyButton && columnDef.enableClickToCopy !== false ? (
						<SRT_CopyButton cell={cell} table={table}>
							<SRT_TableBodyCellValue {...cellValueProps} />
						</SRT_CopyButton>
					) : (
						<SRT_TableBodyCellValue {...cellValueProps} />
					)}
					{cell.getIsGrouped() && !columnDef.GroupedCell && <> ({row.subRows?.length})</>}
				</>
			)}
		</TableCell>
	)
}

export const Memo_SRT_TableBodyCell = memo(
	SRT_TableBodyCell,
	(prev, next) => next.cell === prev.cell,
) as typeof SRT_TableBodyCell
