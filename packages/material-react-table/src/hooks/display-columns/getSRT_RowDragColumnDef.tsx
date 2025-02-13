import type { RefObject } from 'react'
import { MRT_TableBodyRowGrabHandle } from '../../components/body/MRT_TableBodyRowGrabHandle'
import type { MRT_ColumnDef, MRT_RowData, MRT_StatefulTableOptions } from '../../types'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

export const getMRT_RowDragColumnDef = <TData extends MRT_RowData>(
	tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => {
	return {
		Cell: ({ row, rowRef, table }) => (
			<MRT_TableBodyRowGrabHandle
				row={row}
				rowRef={rowRef as RefObject<HTMLTableRowElement | null>}
				table={table}
			/>
		),
		grow: false,
		...defaultDisplayColumnProps({
			header: 'move',
			id: 'srt-row-drag',
			size: 60,
			tableOptions,
		}),
	}
}
