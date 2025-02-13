import { MRT_DefaultDisplayColumn } from '../useMRT_TableOptions'
import type { MRT_ColumnDef, MRT_RowData, MRT_StatefulTableOptions } from '../../types'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

const blankColProps = {
	children: null,
	sx: {
		minWidth: 0,
		p: 0,
		width: 0,
	},
}

export const getMRT_RowSpacerColumnDef = <TData extends MRT_RowData>(
	tableOptions: MRT_StatefulTableOptions<TData>,
): MRT_ColumnDef<TData> => {
	return {
		...defaultDisplayColumnProps({
			id: 'srt-row-spacer',
			size: 0,
			tableOptions,
		}),
		grow: true,
		...MRT_DefaultDisplayColumn,
		muiTableBodyCellProps: blankColProps,
		muiTableFooterCellProps: blankColProps,
		muiTableHeadCellProps: blankColProps,
	}
}
