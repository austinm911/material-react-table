import { SRT_TableBodyRowPinButton } from '../../components/body/SRT_TableBodyRowPinButton'
import type { SRT_ColumnDef, SRT_RowData, SRT_StatefulTableOptions } from '../../types-SRT'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

export const getSRT_RowPinningColumnDef = <TData extends SRT_RowData>(
	tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
	return {
		Cell: ({ row, table }) => <SRT_TableBodyRowPinButton row={row} table={table} />,
		grow: false,
		...defaultDisplayColumnProps({
			header: 'pin',
			id: 'srt-row-pin',
			size: 60,
			tableOptions,
		}),
	}
}
