import { type DragEvent, useMemo } from 'react'
import { SRT_TableHeadCellColumnActionsButton } from './SRT_TableHeadCellColumnActionsButton'
import { SRT_TableHeadCellFilterContainer } from './SRT_TableHeadCellFilterContainer'
import { SRT_TableHeadCellFilterLabel } from './SRT_TableHeadCellFilterLabel'
import { SRT_TableHeadCellGrabHandle } from './SRT_TableHeadCellGrabHandle'
import { SRT_TableHeadCellResizeHandle } from './SRT_TableHeadCellResizeHandle'
import { SRT_TableHeadCellSortLabel } from './SRT_TableHeadCellSortLabel'
import type {
	SRT_Column,
	SRT_ColumnVirtualizer,
	SRT_Header,
	SRT_RowData,
	SRT_TableInstance,
	TableCellProps,
} from '../../types-SRT'
import { getCommonSRTCellStyles } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { cellKeyboardShortcuts } from '../../utils/cell.utils'
import { TableCell } from '../ui/table'
import { cn } from '@/lib/utils'

export interface SRT_TableHeadCellProps<TData extends SRT_RowData> extends TableCellProps {
	columnVirtualizer?: SRT_ColumnVirtualizer
	header: SRT_Header<TData>
	staticColumnIndex?: number
	table: SRT_TableInstance<TData>
}

export const SRT_TableHeadCell = <TData extends SRT_RowData>({
	columnVirtualizer,
	header,
	staticColumnIndex,
	table,
	...rest
}: SRT_TableHeadCellProps<TData>) => {
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
			shadcnTableHeadCellProps,
		},
		refs: { tableHeadCellRefs },
		setHoveredColumn,
	} = table
	const { columnSizingInfo, density, draggingColumn, grouping, hoveredColumn, showColumnFilters } = getState()
	const { column } = header
	const { columnDef } = column
	const { columnDefType } = columnDef

	const tableCellProps = {
		...parseFromValuesOrFunc(shadcnTableHeadCellProps, { column, table }),
		...parseFromValuesOrFunc(columnDef.shadcnTableHeadCellProps, {
			column,
			table,
		}),
		...rest,
	}

	const isColumnPinned = enableColumnPinning && columnDef.columnDefType !== 'group' && column.getIsPinned()

	const showColumnActions =
		(enableColumnActions || columnDef.enableColumnActions) && columnDef.enableColumnActions !== false

	const showDragHandle =
		enableColumnDragging !== false &&
		columnDef.enableColumnDragging !== false &&
		(enableColumnDragging ||
			(enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
			(enableGrouping && columnDef.enableGrouping !== false && !grouping.includes(column.id)))

	const headerPL = useMemo(() => {
		let pl = 0
		if (column.getCanSort()) pl += 1
		if (showColumnActions) pl += 1.75
		if (showDragHandle) pl += 1.5
		return pl
	}, [showColumnActions, showDragHandle])

	const draggingBorders = useMemo(() => {
		const showResizeBorder =
			columnSizingInfo.isResizingColumn === column.id &&
			columnResizeMode === 'onChange' &&
			!header.subHeaders.length

		const borderStyle = showResizeBorder
			? '2px solid !important'
			: draggingColumn?.id === column.id
				? '1px dashed gray'
				: hoveredColumn?.id === column.id
					? '2px dashed'
					: undefined

		if (showResizeBorder) {
			return columnResizeDirection === 'ltr' ? { borderRight: borderStyle } : { borderLeft: borderStyle }
		}
		const draggingBorders = borderStyle
			? {
					borderLeft: borderStyle,
					borderRight: borderStyle,
					borderTop: borderStyle,
				}
			: undefined

		return draggingBorders
	}, [draggingColumn, hoveredColumn, columnSizingInfo.isResizingColumn])

	const handleDragEnter = (_e: DragEvent) => {
		if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
			setHoveredColumn(null)
		}
		if (enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
			setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
		}
	}

	const handleDragOver = (e: DragEvent) => {
		if (columnDef.enableColumnOrdering !== false) {
			e.preventDefault()
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
		tableCellProps?.onKeyDown?.(event)
		cellKeyboardShortcuts({
			event,
			cellValue: header.column.columnDef.header,
			table,
			header,
		})
	}

	const HeaderElement =
		parseFromValuesOrFunc(columnDef.Header, {
			column,
			header,
			table,
		}) ?? columnDef.header

	const textAlign = columnDefType === 'group' ? 'center' : 'left'
	const isRtl = false // Replace with actual RTL detection if needed

	return (
		<TableCell
			aria-sort={column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'ascending' : 'descending') : 'none'}
			colSpan={header.colSpan}
			data-can-sort={column.getCanSort() || undefined}
			data-index={staticColumnIndex}
			data-pinned={!!isColumnPinned || undefined}
			data-sort={column.getIsSorted() || undefined}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			ref={(node: HTMLTableCellElement) => {
				if (node) {
					tableHeadCellRefs.current = {
						...tableHeadCellRefs.current,
						[column.id]: node,
					}
					if (columnDefType !== 'group') {
						columnVirtualizer?.measureElement?.(node)
					}
				}
			}}
			tabIndex={enableKeyboardShortcuts ? 0 : undefined}
			{...tableCellProps}
			onKeyDown={handleKeyDown}
			className={cn(
				'overflow-visible font-bold',
				density === 'compact'
					? 'p-2'
					: density === 'comfortable'
						? columnDefType === 'display'
							? 'p-3'
							: 'p-4'
						: columnDefType === 'display'
							? 'px-5 py-4'
							: 'p-6',
				columnDefType === 'display' ? 'pb-0' : showColumnFilters || density === 'compact' ? 'pb-1.5' : 'pb-2.5',
				columnDefType === 'group' || density === 'compact'
					? 'pt-1'
					: density === 'comfortable'
						? 'pt-3'
						: 'pt-5',
				enableMultiSort && column.getCanSort() ? 'select-none' : '',
				textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left',
				tableCellProps.className,
			)}
			style={{
				...getCommonSRTCellStyles({
					column,
					header,
					table,
					tableCellProps,
				}),
				...draggingBorders,
				...(layoutMode?.startsWith('grid') ? { flexDirection: 'column' } : {}),
				...tableCellProps.style,
			}}
		>
			{header.isPlaceholder
				? null
				: (tableCellProps.children ?? (
						<div
							className="flex items-center w-full"
							style={{
								flexDirection: tableCellProps?.align === 'right' ? 'row-reverse' : 'row',
								justifyContent:
									columnDefType === 'group' || tableCellProps?.align === 'center'
										? 'center'
										: column.getCanResize()
											? 'space-between'
											: 'flex-start',
								position: 'relative',
							}}
						>
							<div
								className="flex items-center"
								onKeyDown={column.getToggleSortingHandler()}
								style={{
									cursor: column.getCanSort() && columnDefType !== 'group' ? 'pointer' : undefined,
									flexDirection: tableCellProps?.align === 'right' ? 'row-reverse' : 'row',
									overflow: columnDefType === 'data' ? 'hidden' : undefined,
									paddingLeft: tableCellProps?.align === 'center' ? `${headerPL}rem` : undefined,
								}}
							>
								<div
									className="hover:text-clip"
									style={{
										minWidth: `${Math.min(columnDef.header?.length ?? 0, 4)}ch`,
										overflow: columnDefType === 'data' ? 'hidden' : undefined,
										textOverflow: 'ellipsis',
										whiteSpace: (columnDef.header?.length ?? 0) < 20 ? 'nowrap' : 'normal',
									}}
								>
									{HeaderElement}
								</div>
								{column.getCanFilter() && (
									<SRT_TableHeadCellFilterLabel header={header} table={table} />
								)}
								{column.getCanSort() && <SRT_TableHeadCellSortLabel header={header} table={table} />}
							</div>
							{columnDefType !== 'group' && (
								<div className="whitespace-nowrap">
									{showDragHandle && (
										<SRT_TableHeadCellGrabHandle
											column={column}
											table={table}
											tableHeadCellRef={{
												current: tableHeadCellRefs.current?.[column.id] ?? null,
											}}
										/>
									)}
									{showColumnActions && (
										<SRT_TableHeadCellColumnActionsButton header={header} table={table} />
									)}
								</div>
							)}
							{column.getCanResize() && <SRT_TableHeadCellResizeHandle header={header} table={table} />}
						</div>
					))}
			{columnFilterDisplayMode === 'subheader' && column.getCanFilter() && (
				<SRT_TableHeadCellFilterContainer header={header} table={table} />
			)}
		</TableCell>
	)
}
