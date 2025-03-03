import { cn } from '@/lib/utils'
import { TableRow } from '../ui/table'
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
import { SRT_TableHeadCell } from './SRT_TableHeadCell'

export interface SRT_TableHeadRowProps<TData extends SRT_RowData> extends TableRowProps {
	columnVirtualizer?: SRT_ColumnVirtualizer
	headerGroup: SRT_HeaderGroup<TData>
	table: SRT_TableInstance<TData>
}

export const SRT_TableHeadRow = <TData extends SRT_RowData>({
	columnVirtualizer,
	headerGroup,
	table,
	...rest
}: SRT_TableHeadRowProps<TData>) => {
	const {
		options: { enableStickyHeader, layoutMode, shadcnTableHeadRowProps },
	} = table

	const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } = columnVirtualizer ?? {}

	// Merge custom props passed via table config with any additional overrides
	const resolvedProps = {
		...parseFromValuesOrFunc(shadcnTableHeadRowProps, { headerGroup, table }),
		...rest,
	}

	return (
		<TableRow
			{...resolvedProps}
			className={cn(
				resolvedProps.className,
				'shadow-md',
				layoutMode?.startsWith('grid') && 'flex',
				enableStickyHeader && layoutMode === 'semantic' ? 'sticky top-0' : 'relative',
			)}
			style={{
				...(resolvedProps.style || {}),
			}}
		>
			{virtualPaddingLeft ? <th className="flex" style={{ width: virtualPaddingLeft }} /> : null}
			{(virtualColumns ?? headerGroup.headers).map((headerOrVirtualHeader, index) => {
				// Handle virtualization without reassigning parameters
				const currentHeader = columnVirtualizer
					? headerGroup.headers[(headerOrVirtualHeader as SRT_VirtualItem).index]
					: (headerOrVirtualHeader as SRT_Header<TData>)

				return currentHeader ? (
					<SRT_TableHeadCell
						columnVirtualizer={columnVirtualizer}
						header={currentHeader}
						key={currentHeader.id}
						staticColumnIndex={columnVirtualizer ? (headerOrVirtualHeader as SRT_VirtualItem).index : index}
						table={table}
					/>
				) : null
			})}
			{virtualPaddingRight ? <th className="flex" style={{ width: virtualPaddingRight }} /> : null}
		</TableRow>
	)
}
