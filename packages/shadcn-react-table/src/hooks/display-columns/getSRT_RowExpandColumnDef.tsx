import type { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/ui/tooltip'
import { SRT_ExpandAllButton } from '../../components/buttons/SRT_ExpandAllButton'
import { SRT_ExpandButton } from '../../components/buttons/SRT_ExpandButton'
import type { SRT_ColumnDef, SRT_RowData, SRT_StatefulTableOptions } from '../../types-SRT'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

export const getSRT_RowExpandColumnDef = <TData extends SRT_RowData>(
	tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
	const {
		defaultColumn,
		enableExpandAll,
		groupedColumnMode,
		positionExpandColumn,
		renderDetailPanel,
		state: { grouping },
	} = tableOptions

	const alignProps =
		positionExpandColumn === 'last'
			? ({
					align: 'right',
				} as const)
			: undefined

	return {
		Cell: ({ cell, column, row, staticRowIndex, table }) => {
			const expandButtonProps = { row, staticRowIndex, table }
			const subRowsLength = row.subRows?.length
			if (groupedColumnMode === 'remove' && row.groupingColumnId) {
				return (
					<div className="flex items-center gap-1">
						<SRT_ExpandButton {...expandButtonProps} />
						<Tooltip>
							<TooltipTrigger asChild>
								<span>{row.groupingValue as ReactNode}</span>
							</TooltipTrigger>
							<TooltipContent>{table.getColumn(row.groupingColumnId).columnDef.header}</TooltipContent>
						</Tooltip>
						{!!subRowsLength && <span>({subRowsLength})</span>}
					</div>
				)
			}

			return (
				<>
					<SRT_ExpandButton {...expandButtonProps} />
					{column.columnDef.GroupedCell?.({ cell, column, row, table })}
				</>
			)
		},
		Header: enableExpandAll
			? ({ table }) => {
					return (
						<>
							<SRT_ExpandAllButton table={table} />
							{groupedColumnMode === 'remove' &&
								grouping
									?.map((groupedColumnId) => table.getColumn(groupedColumnId).columnDef.header)
									?.join(', ')}
						</>
					)
				}
			: undefined,
		shadcnTableBodyCellProps: alignProps,
		shadcnTableHeadCellProps: alignProps,
		...defaultDisplayColumnProps({
			header: 'expand',
			id: 'srt-row-expand',
			size:
				groupedColumnMode === 'remove'
					? (defaultColumn?.size ?? 180)
					: renderDetailPanel
						? enableExpandAll
							? 60
							: 70
						: 100,
			tableOptions,
		}),
	}
}
