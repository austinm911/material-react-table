import type { RefObject } from 'react'
import { Table, TableCell, TableRow } from '../ui/table'
import type { SRT_Row, SRT_RowData, SRT_RowVirtualizer, SRT_TableInstance, SRT_VirtualItem } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { cn } from '@/lib/utils'

// Duplicate of MRT_TableDetailPanel with SRT_ prefix
export interface SRT_TableDetailPanelProps<TData extends SRT_RowData> {
	parentRowRef: RefObject<HTMLTableRowElement | null>
	row: SRT_Row<TData>
	rowVirtualizer?: SRT_RowVirtualizer
	staticRowIndex: number
	table: SRT_TableInstance<TData>
	virtualRow?: SRT_VirtualItem
}

export const SRT_TableDetailPanel = <TData extends SRT_RowData>({
	parentRowRef,
	row,
	rowVirtualizer,
	staticRowIndex,
	table,
	virtualRow,
}: SRT_TableDetailPanelProps<TData>) => {
	const {
		getVisibleLeafColumns,
		options: {
			layoutMode,
			srtTheme: { baseBackgroundColor },
			shadcnDetailPanelProps,
			shadcnTableBodyRowProps,
			renderDetailPanel,
		},
	} = table

	const tableRowProps = parseFromValuesOrFunc(shadcnTableBodyRowProps, {
		isDetailPanel: true,
		row,
		staticRowIndex,
		table,
	})
	const tableCellProps = parseFromValuesOrFunc(shadcnDetailPanelProps, {
		row,
		table,
	})

	const DetailPanel = !table.getState().isLoading && renderDetailPanel?.({ row, table })

	return (
		<TableRow
			{...tableRowProps}
			className={cn(
				layoutMode?.startsWith('grid') ? 'flex' : '',
				virtualRow ? 'absolute w-full' : '',
				tableRowProps?.className,
			)}
			data-index={renderDetailPanel ? staticRowIndex * 2 + 1 : staticRowIndex}
			ref={(node: HTMLTableRowElement) => {
				if (node) {
					rowVirtualizer?.measureElement?.(node)
				}
			}}
			style={{
				top: virtualRow ? `${parentRowRef.current?.getBoundingClientRect()?.height}px` : undefined,
				transform: virtualRow ? `translateY(${virtualRow.start}px)` : undefined,
				...(tableRowProps?.style as any),
			}}
		>
			<TableCell
				colSpan={getVisibleLeafColumns().length}
				{...tableCellProps}
				className={cn(
					'w-full',
					layoutMode?.startsWith('grid') ? 'flex' : '',
					!!DetailPanel && row.getIsExpanded() ? 'py-4' : 'py-0',
					virtualRow ? '' : 'transition-all duration-150 ease-in-out',
					tableCellProps?.className,
				)}
				style={{
					backgroundColor: virtualRow ? baseBackgroundColor : undefined,
					borderBottom: !row.getIsExpanded() ? 'none' : undefined,
					...(tableCellProps?.style as any),
				}}
			>
				<div
					className={cn(
						'overflow-hidden transition-all duration-300',
						row.getIsExpanded() ? 'max-h-[1000px]' : 'max-h-0',
					)}
				>
					{DetailPanel}
				</div>
			</TableCell>
		</TableRow>
	)
}
