import { SRT_DefaultDisplayColumn } from '../useSRT_TableOptions'
import type { SRT_ColumnDef, SRT_RowData, SRT_StatefulTableOptions } from '../../types-SRT'
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils'

const blankColProps = {
	children: null,
	sx: {
		minWidth: 0,
		p: 0,
		width: 0,
	},
}

export const getSRT_RowSpacerColumnDef = <TData extends SRT_RowData>(
	tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
	return {
		...defaultDisplayColumnProps({
			id: 'srt-row-spacer',
			size: 0,
			tableOptions,
		}),
		grow: true,
		...SRT_DefaultDisplayColumn,
		shadcnTableBodyCellProps: blankColProps,
		shadcnTableFooterCellProps: blankColProps,
		shadcnTableHeadCellProps: blankColProps,
	}
}
