import { memo, useMemo } from 'react'
import type { VirtualItem } from '@tanstack/react-virtual'
import { SRT_TableBodyRow, Memo_SRT_TableBodyRow } from './SRT_TableBodyRow'
import { useSRT_RowVirtualizer } from '../../hooks/useSRT_RowVirtualizer'
import { useSRT_Rows } from '../../hooks/useSRT_Rows'
import type { SRT_ColumnVirtualizer, SRT_Row, SRT_RowData, SRT_TableInstance, TableBodyProps } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { TableBody, TableRow, TableCell } from '../ui/table'
import { cn } from '@/lib/utils'

export interface SRT_TableBodyProps<TData extends SRT_RowData> extends TableBodyProps {
	columnVirtualizer?: SRT_ColumnVirtualizer
	table: SRT_TableInstance<TData>
}

export const SRT_TableBody = <TData extends SRT_RowData>({
	columnVirtualizer,
	table,
	className,
	...rest
}: SRT_TableBodyProps<TData>) => {
	const {
		getBottomRows,
		getIsSomeRowsPinned,
		getRowModel,
		getState,
		getTopRows,
		options: {
			enableStickyFooter,
			enableStickyHeader,
			layoutMode,
			localization,
			memoMode,
			shadcnTableBodyProps,
			renderDetailPanel,
			renderEmptyRowsFallback,
			rowPinningDisplayMode,
		},
		refs: { tableFooterRef, tableHeadRef, tablePaperRef },
	} = table
	const { columnFilters, globalFilter, isFullScreen, rowPinning } = getState()

	const tableBodyProps = {
		...parseFromValuesOrFunc(shadcnTableBodyProps, { table }),
		...rest,
	}

	const tableHeadHeight = ((enableStickyHeader || isFullScreen) && tableHeadRef.current?.clientHeight) || 0
	const tableFooterHeight = (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0

	const pinnedRowIds = useMemo(() => {
		if (!rowPinning.bottom?.length && !rowPinning.top?.length) return []
		return getRowModel()
			.rows.filter((row) => row.getIsPinned())
			.map((r) => r.id)
	}, [rowPinning, getRowModel().rows])

	const rows = useSRT_Rows(table)

	const rowVirtualizer = useSRT_RowVirtualizer(table, rows)

	const { virtualRows } = rowVirtualizer ?? {}

	const commonRowProps = {
		columnVirtualizer,
		numRows: rows.length,
		table,
	}

	return (
		<>
			{!rowPinningDisplayMode?.includes('sticky') && getIsSomeRowsPinned('top') && (
				<TableBody
					{...tableBodyProps}
					className={cn(className)}
					style={{
						display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
						position: 'sticky',
						top: tableHeadHeight - 1,
						zIndex: 1,
					}}
				>
					{getTopRows().map((row, staticRowIndex) => {
						const props = {
							...commonRowProps,
							row,
							staticRowIndex,
						}
						return memoMode === 'rows' ? (
							<Memo_SRT_TableBodyRow key={row.id} {...props} />
						) : (
							<SRT_TableBodyRow key={row.id} {...props} />
						)
					})}
				</TableBody>
			)}
			<TableBody
				{...tableBodyProps}
				className={cn(className)}
				style={{
					display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
					height: rowVirtualizer ? `${rowVirtualizer.getTotalSize()}px` : undefined,
					minHeight: !rows.length ? '100px' : undefined,
					position: 'relative',
				}}
			>
				{tableBodyProps?.children ??
					(!rows.length ? (
						<TableRow
							style={{
								display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
							}}
						>
							<TableCell
								colSpan={table.getVisibleLeafColumns().length}
								style={{
									display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
								}}
							>
								{renderEmptyRowsFallback?.({ table }) ?? (
									<div
										className="text-muted-foreground italic text-center py-8 w-full"
										style={{
											maxWidth: `min(100vw, ${tablePaperRef.current?.clientWidth ?? 360}px)`,
										}}
									>
										{globalFilter || columnFilters.length
											? localization.noResultsFound
											: localization.noRecordsToDisplay}
									</div>
								)}
							</TableCell>
						</TableRow>
					) : (
						<>
							{(virtualRows ?? rows).map((rowOrVirtualRow, index) => {
								let row = rowOrVirtualRow as SRT_Row<TData>
								let staticRowIndex = index

								if (rowVirtualizer) {
									if (renderDetailPanel) {
										if (rowOrVirtualRow.index % 2 === 1) {
											return null
										}

										staticRowIndex = rowOrVirtualRow.index / 2
									} else {
										staticRowIndex = rowOrVirtualRow.index
									}
									row = rows[staticRowIndex]
								}

								const props = {
									...commonRowProps,
									pinnedRowIds,
									row,
									rowVirtualizer,
									staticRowIndex,
									virtualRow: rowVirtualizer ? (rowOrVirtualRow as VirtualItem) : undefined,
								}
								const key = `${row.id}-${row.index}`
								return memoMode === 'rows' ? (
									<Memo_SRT_TableBodyRow key={key} {...props} />
								) : (
									<SRT_TableBodyRow key={key} {...props} />
								)
							})}
						</>
					))}
			</TableBody>
			{!rowPinningDisplayMode?.includes('sticky') && getIsSomeRowsPinned('bottom') && (
				<TableBody
					{...tableBodyProps}
					className={cn(className)}
					style={{
						bottom: tableFooterHeight - 1,
						display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
						position: 'sticky',
						zIndex: 1,
					}}
				>
					{getBottomRows().map((row, staticRowIndex) => {
						const props = {
							...commonRowProps,
							row,
							staticRowIndex,
						}
						return memoMode === 'rows' ? (
							<Memo_SRT_TableBodyRow key={row.id} {...props} />
						) : (
							<SRT_TableBodyRow key={row.id} {...props} />
						)
					})}
				</TableBody>
			)}
		</>
	)
}

export const Memo_SRT_TableBody = memo(
	SRT_TableBody,
	(prev, next) => prev.table.options.data === next.table.options.data,
) as typeof SRT_TableBody
