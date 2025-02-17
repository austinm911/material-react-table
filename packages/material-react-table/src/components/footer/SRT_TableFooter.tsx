import { SRT_TableFooterRow } from './SRT_TableFooterRow'
import type { SRT_ColumnVirtualizer, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import type { TableFooterProps } from '@/types-SRT'
import { TableFooter } from '../ui/table'
import { cn } from '@/lib/utils'

export interface SRT_TableFooterProps<TData extends SRT_RowData> extends TableFooterProps {
	columnVirtualizer?: SRT_ColumnVirtualizer
	table: SRT_TableInstance<TData>
}

export const SRT_TableFooter = <TData extends SRT_RowData>({
	columnVirtualizer,
	table,
	className,
	...rest
}: SRT_TableFooterProps<TData>) => {
	const {
		getState,
		options: { enableStickyFooter, layoutMode },
		refs: { tableFooterRef },
	} = table
	const { isFullScreen } = getState()

	const stickFooter = (isFullScreen || enableStickyFooter) && enableStickyFooter !== false

	const footerGroups = table.getFooterGroups()

	// if no footer cells at all, skip footer
	if (
		!footerGroups.some((footerGroup) =>
			footerGroup.headers?.some(
				(header) =>
					(typeof header.column.columnDef.footer === 'string' && !!header.column.columnDef.footer) ||
					header.column.columnDef.Footer,
			),
		)
	) {
		return null
	}

	return (
		<TableFooter
			{...rest}
			ref={(ref: HTMLTableSectionElement) => {
				tableFooterRef.current = ref
			}}
			className={cn(
				'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
				stickFooter && 'sticky bottom-0 z-10 opacity-95',
				layoutMode?.startsWith('grid') && 'grid',
				className,
			)}
		>
			{footerGroups.map((footerGroup) => (
				<SRT_TableFooterRow
					columnVirtualizer={columnVirtualizer}
					footerGroup={footerGroup}
					key={footerGroup.id}
					table={table}
				/>
			))}
		</TableFooter>
	)
}
