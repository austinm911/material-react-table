import { getCommonSRTCellStyles } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { cellKeyboardShortcuts } from '../../utils/cell.utils'
import { TableCell } from '../ui/table'
import { cn } from '@/lib/utils'
import type { SRT_Header, SRT_RowData, SRT_TableInstance, TableCellProps } from '@/types-SRT'

export interface SRT_TableFooterCellProps<TData extends SRT_RowData> extends TableCellProps {
	footer: SRT_Header<TData>
	staticColumnIndex?: number
	table: SRT_TableInstance<TData>
}

export const SRT_TableFooterCell = <TData extends SRT_RowData>({
	footer,
	staticColumnIndex,
	table,
	className,
	...rest
}: SRT_TableFooterCellProps<TData>) => {
	const {
		getState,
		options: { enableColumnPinning, shadcnTableFooterCellProps: muiTableFooterCellProps, enableKeyboardShortcuts },
	} = table
	const { density } = getState()
	const { column } = footer
	const { columnDef } = column
	const { columnDefType } = columnDef

	const isColumnPinned = enableColumnPinning && columnDef.columnDefType !== 'group' && column.getIsPinned()

	const args = { column, table }
	const tableCellProps = {
		...parseFromValuesOrFunc(muiTableFooterCellProps, args),
		...parseFromValuesOrFunc(columnDef.shadcnTableFooterCellProps, args),
		...rest,
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
		tableCellProps?.onKeyDown?.(event)
		cellKeyboardShortcuts({
			event,
			cellValue: footer.column.columnDef.footer,
			table,
		})
	}

	return (
		<TableCell
			{...tableCellProps}
			data-index={staticColumnIndex}
			data-pinned={!!isColumnPinned || undefined}
			tabIndex={enableKeyboardShortcuts ? 0 : undefined}
			className={cn(
				'font-bold',
				density === 'compact' && 'p-2',
				density === 'comfortable' && 'p-4',
				density === 'normal' && 'p-6',
				'align-top',
				className,
			)}
			onKeyDown={handleKeyDown}
		>
			{tableCellProps.children ??
				(footer.isPlaceholder
					? null
					: (parseFromValuesOrFunc(columnDef.Footer, {
							column,
							footer,
							table,
						}) ??
						columnDef.footer ??
						null))}
		</TableCell>
	)
}
