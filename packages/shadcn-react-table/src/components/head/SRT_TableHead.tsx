import { cn } from '@/lib/utils'
import { SRT_TableHeadRow } from './SRT_TableHeadRow'
import { TableHead, TableHeader, TableRow } from '../ui/table'
import type { SRT_ColumnVirtualizer, SRT_RowData, SRT_TableInstance, TableHeadProps } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_ToolbarAlertBanner } from '../toolbar/SRT_ToolbarAlertBanner'

export interface SRT_TableHeadProps<TData extends SRT_RowData> extends TableHeadProps {
	columnVirtualizer?: SRT_ColumnVirtualizer
	table: SRT_TableInstance<TData>
}

export const SRT_TableHead = <TData extends SRT_RowData>({
	columnVirtualizer,
	table,
	...rest
}: SRT_TableHeadProps<TData>) => {
	const {
		getState,
		options: { enableStickyHeader, layoutMode, shadcnTableHeadProps, positionToolbarAlertBanner },
		refs: { tableHeadRef },
	} = table
	const { isFullScreen, showAlertBanner } = getState()

	const tableHeadProps = {
		...parseFromValuesOrFunc(shadcnTableHeadProps, { table }),
		...rest,
	}

	const stickyHeader = enableStickyHeader || isFullScreen

	return (
		<TableHeader
			{...tableHeadProps}
			ref={(ref: HTMLTableSectionElement) => {
				tableHeadRef.current = ref
				if (tableHeadProps?.ref) {
					tableHeadProps.ref.current = ref
				}
			}}
			className={cn(
				'opacity-97',
				layoutMode?.startsWith('grid') && 'grid',
				stickyHeader && 'sticky top-0 z-[2]',
				tableHeadProps?.className,
			)}
		>
			{positionToolbarAlertBanner === 'head-overlay' &&
			(showAlertBanner || table.getSelectedRowModel().rows.length > 0) ? (
				<TableRow className={cn(layoutMode?.startsWith('grid') && 'grid', 'w-full [&>th]:p-0')}>
					<TableHead
						colSpan={table.getVisibleLeafColumns().length}
						className={cn(layoutMode?.startsWith('grid') && 'grid')}
					>
						<SRT_ToolbarAlertBanner table={table} />
					</TableHead>
				</TableRow>
			) : (
				table
					.getHeaderGroups()
					.map((headerGroup) => (
						<SRT_TableHeadRow
							columnVirtualizer={columnVirtualizer}
							headerGroup={headerGroup}
							key={headerGroup.id}
							table={table}
						/>
					))
			)}
		</TableHeader>
	)
}
