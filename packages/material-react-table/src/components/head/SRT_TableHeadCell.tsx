import { type DragEvent, useMemo } from 'react'
import Box from '@mui/material/Box'
import TableCell, { type TableCellProps } from '@mui/material/TableCell'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { SRT_TableHeadCellColumnActionsButton } from './SRT_TableHeadCellColumnActionsButton'
import { SRT_TableHeadCellFilterContainer } from './SRT_TableHeadCellFilterContainer'
import { SRT_TableHeadCellFilterLabel } from './SRT_TableHeadCellFilterLabel'
import { SRT_TableHeadCellGrabHandle } from './SRT_TableHeadCellGrabHandle'
import { SRT_TableHeadCellResizeHandle } from './SRT_TableHeadCellResizeHandle'
import { SRT_TableHeadCellSortLabel } from './SRT_TableHeadCellSortLabel'
import type { SRT_ColumnVirtualizer, SRT_Header, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { getCommonSRTCellStyles } from '../../utils/style.utils.shadcn'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { cellKeyboardShortcuts } from '../../utils/cell.utils.shadcn'

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
	const theme = useTheme()
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
			shadcnTheme: { draggingBorderColor },
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
			? `2px solid ${draggingBorderColor} !important`
			: draggingColumn?.id === column.id
				? `1px dashed ${theme.palette.grey[500]}`
				: hoveredColumn?.id === column.id
					? `2px dashed ${draggingBorderColor}`
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

	return (
		<TableCell
			align={columnDefType === 'group' ? 'center' : theme.direction === 'rtl' ? 'right' : 'left'}
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
					tableHeadCellRefs.current![column.id] = node
					if (columnDefType !== 'group') {
						columnVirtualizer?.measureElement?.(node)
					}
				}
			}}
			tabIndex={enableKeyboardShortcuts ? 0 : undefined}
			{...tableCellProps}
			onKeyDown={handleKeyDown}
			sx={(theme: Theme) => ({
				'& :hover': {
					'.MuiButtonBase-root': {
						opacity: 1,
					},
				},
				flexDirection: layoutMode?.startsWith('grid') ? 'column' : undefined,
				fontWeight: 'bold',
				overflow: 'visible',
				p:
					density === 'compact'
						? '0.5rem'
						: density === 'comfortable'
							? columnDefType === 'display'
								? '0.75rem'
								: '1rem'
							: columnDefType === 'display'
								? '1rem 1.25rem'
								: '1.5rem',
				pb: columnDefType === 'display' ? 0 : showColumnFilters || density === 'compact' ? '0.4rem' : '0.6rem',
				pt:
					columnDefType === 'group' || density === 'compact'
						? '0.25rem'
						: density === 'comfortable'
							? '.75rem'
							: '1.25rem',
				userSelect: enableMultiSort && column.getCanSort() ? 'none' : undefined,
				verticalAlign: 'top',
				...getCommonSRTCellStyles({
					column,
					header,
					table,
					tableCellProps,
					theme,
				}),
				...draggingBorders,
			})}
		>
			{header.isPlaceholder
				? null
				: (tableCellProps.children ?? (
						<Box
							className="Mui-TableHeadCell-Content"
							sx={{
								alignItems: 'center',
								display: 'flex',
								flexDirection: tableCellProps?.align === 'right' ? 'row-reverse' : 'row',
								justifyContent:
									columnDefType === 'group' || tableCellProps?.align === 'center'
										? 'center'
										: column.getCanResize()
											? 'space-between'
											: 'flex-start',
								position: 'relative',
								width: '100%',
							}}
						>
							<Box
								className="Mui-TableHeadCell-Content-Labels"
								onClick={column.getToggleSortingHandler()}
								sx={{
									alignItems: 'center',
									cursor: column.getCanSort() && columnDefType !== 'group' ? 'pointer' : undefined,
									display: 'flex',
									flexDirection: tableCellProps?.align === 'right' ? 'row-reverse' : 'row',
									overflow: columnDefType === 'data' ? 'hidden' : undefined,
									pl: tableCellProps?.align === 'center' ? `${headerPL}rem` : undefined,
								}}
							>
								<Box
									className="Mui-TableHeadCell-Content-Wrapper"
									sx={{
										'&:hover': {
											textOverflow: 'clip',
										},
										minWidth: `${Math.min(columnDef.header?.length ?? 0, 4)}ch`,
										overflow: columnDefType === 'data' ? 'hidden' : undefined,
										textOverflow: 'ellipsis',
										whiteSpace: (columnDef.header?.length ?? 0) < 20 ? 'nowrap' : 'normal',
									}}
								>
									{HeaderElement}
								</Box>
								{column.getCanFilter() && (
									<SRT_TableHeadCellFilterLabel header={header} table={table} />
								)}
								{column.getCanSort() && <SRT_TableHeadCellSortLabel header={header} table={table} />}
							</Box>
							{columnDefType !== 'group' && (
								<Box
									className="Mui-TableHeadCell-Content-Actions"
									sx={{
										whiteSpace: 'nowrap',
									}}
								>
									{showDragHandle && (
										<SRT_TableHeadCellGrabHandle
											column={column}
											table={table}
											tableHeadCellRef={{
												current: tableHeadCellRefs.current?.[column.id]!,
											}}
										/>
									)}
									{showColumnActions && (
										<SRT_TableHeadCellColumnActionsButton header={header} table={table} />
									)}
								</Box>
							)}
							{column.getCanResize() && <SRT_TableHeadCellResizeHandle header={header} table={table} />}
						</Box>
					))}
			{columnFilterDisplayMode === 'subheader' && column.getCanFilter() && (
				<SRT_TableHeadCellFilterContainer header={header} table={table} />
			)}
		</TableCell>
	)
}
