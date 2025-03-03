import type { RefObject } from 'react'
import { SRT_TableBodyRowGrabHandle } from '../../components/body/SRT_TableBodyRowGrabHandle'
import type { SRT_ColumnDef, SRT_RowData, SRT_StatefulTableOptions } from '../../types-SRT'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils.shadcn'

export const getSRT_RowDragColumnDef = <TData extends SRT_RowData>(
	tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
	return {
		Cell: ({ row, rowRef, table }) => (
			<SRT_TableBodyRowGrabHandle
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
