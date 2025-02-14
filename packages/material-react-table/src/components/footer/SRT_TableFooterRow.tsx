import { SRT_TableFooterCell } from './SRT_TableFooterCell'
import type {
	SRT_ColumnVirtualizer,
	SRT_Header,
	SRT_HeaderGroup,
	SRT_RowData,
	SRT_TableInstance,
	SRT_VirtualItem,
	TableRowProps,
} from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { TableRow } from '../ui/table'
import { cn } from '@/lib/utils'

export interface SRT_TableFooterRowProps<TData extends SRT_RowData> extends TableRowProps {
	columnVirtualizer?: SRT_ColumnVirtualizer
	footerGroup: SRT_HeaderGroup<TData>
	table: SRT_TableInstance<TData>
}

export const SRT_TableFooterRow = <TData extends SRT_RowData>({
	columnVirtualizer,
	footerGroup,
	table,
	className,
	...rest
}: SRT_TableFooterRowProps<TData>) => {
	const {
		options: {
			layoutMode,
			srtTheme: { baseBackgroundColor },
			shadcnTableFooterRowProps: muiTableFooterRowProps,
		},
	} = table

	const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } = columnVirtualizer ?? {}

	// if no content in row, skip row
	if (
		!footerGroup.headers?.some(
			(header) =>
				(typeof header.column.columnDef.footer === 'string' && !!header.column.columnDef.footer) ||
				header.column.columnDef.Footer,
		)
	) {
		return null
	}

	const tableRowProps = {
		...parseFromValuesOrFunc(muiTableFooterRowProps, { footerGroup, table }),
		...rest,
	}

	return (
		<TableRow
			{...tableRowProps}
			className={cn(
				'bg-muted/50 border-t font-medium',
				layoutMode?.startsWith('grid') && 'flex',
				'relative w-full',
				className,
			)}
		>
			{virtualPaddingLeft ? <th className="flex" style={{ width: virtualPaddingLeft }} /> : null}
			{(virtualColumns ?? footerGroup.headers).map((footerOrVirtualFooter, staticColumnIndex) => {
				let footer = footerOrVirtualFooter as SRT_Header<TData>
				if (columnVirtualizer) {
					staticColumnIndex = (footerOrVirtualFooter as SRT_VirtualItem).index
					footer = footerGroup.headers[staticColumnIndex]
				}

				return footer ? (
					<SRT_TableFooterCell
						footer={footer}
						key={footer.id}
						staticColumnIndex={staticColumnIndex}
						table={table}
					/>
				) : null
			})}
			{virtualPaddingRight ? <th className="flex" style={{ width: virtualPaddingRight }} /> : null}
		</TableRow>
	)
}
