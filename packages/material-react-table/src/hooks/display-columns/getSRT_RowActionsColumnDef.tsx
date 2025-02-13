import { SRT_ToggleRowActionMenuButton } from '../../components/buttons/SRT_ToggleRowActionMenuButton'
import type { SRT_ColumnDef, SRT_RowData, SRT_StatefulTableOptions } from '../../types-SRT'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils.shadcn'

export const getSRT_RowActionsColumnDef = <TData extends SRT_RowData>(
	tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
	return {
		Cell: ({ cell, row, staticRowIndex, table }) => (
			<SRT_ToggleRowActionMenuButton cell={cell} row={row} staticRowIndex={staticRowIndex} table={table} />
		),
		...defaultDisplayColumnProps({
			header: 'actions',
			id: 'srt-row-actions',
			size: 70,
			tableOptions,
		}),
	}
}
