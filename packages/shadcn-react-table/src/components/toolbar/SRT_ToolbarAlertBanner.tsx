import { Fragment, useMemo } from 'react'
import { Alert, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import type { AlertProps, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { getSRT_SelectAllHandler } from '../../utils/row.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_SelectCheckbox } from '../inputs/SRT_SelectCheckbox'
import { cn } from '@/lib/utils'

export interface SRT_ToolbarAlertBannerProps<TData extends SRT_RowData> extends AlertProps {
	stackAlertBanner?: boolean
	table: SRT_TableInstance<TData>
}

export const SRT_ToolbarAlertBanner = <TData extends SRT_RowData>({
	stackAlertBanner,
	table,
	...rest
}: SRT_ToolbarAlertBannerProps<TData>) => {
	const {
		getFilteredSelectedRowModel,
		getCoreRowModel,
		getState,
		options: {
			enableRowSelection,
			enableSelectAll,
			localization,
			manualPagination,
			shadcnToolbarAlertBannerChipProps,
			shadcnToolbarAlertBannerProps,
			positionToolbarAlertBanner,
			renderToolbarAlertBannerContent,
			rowCount,
		},
		refs: { tablePaperRef },
	} = table
	const { density, grouping, rowSelection, showAlertBanner } = getState()

	const alertProps = {
		...parseFromValuesOrFunc(shadcnToolbarAlertBannerProps, {
			table,
		}),
		...rest,
	}

	const chipProps = parseFromValuesOrFunc(shadcnToolbarAlertBannerChipProps, {
		table,
	})

	const totalRowCount = rowCount ?? getCoreRowModel().rows.length

	const selectedRowCount = useMemo(
		() =>
			manualPagination
				? Object.values(rowSelection).filter(Boolean).length
				: getFilteredSelectedRowModel().rows.length,
		[rowSelection, totalRowCount, manualPagination],
	)
	const selectedAlert =
		selectedRowCount > 0 ? (
			<div className="flex items-center gap-4">
				{localization.selectedCountOfRowCountRowsSelected
					?.replace('{selectedCount}', selectedRowCount.toLocaleString())
					?.replace('{rowCount}', totalRowCount.toString())}
				<Button
					onClick={(event) => getSRT_SelectAllHandler({ table })(event, false, true)}
					size="sm"
					className="p-0.5"
				>
					{localization.clearSelection}
				</Button>
			</div>
		) : null

	const groupedAlert =
		grouping.length > 0 ? (
			<span>
				{localization.groupedBy}{' '}
				{grouping.map((columnId, index) => (
					<Fragment key={`${index}-${columnId}`}>
						{index > 0 ? localization.thenBy : ''}
						<Badge
							variant="secondary"
							className="mr-1"
							onClick={() => table.getColumn(columnId).toggleGrouping()}
							{...chipProps}
						>
							{table.getColumn(columnId).columnDef.header}
						</Badge>
					</Fragment>
				))}
			</span>
		) : null

	return (
		<Collapsible
			open={showAlertBanner || !!selectedAlert || !!groupedAlert}
			className={cn('w-full', stackAlertBanner ? 'transition-all duration-200' : 'transition-none')}
		>
			<CollapsibleContent>
				<Alert
					variant="default"
					{...alertProps}
					className={cn(
						'rounded-none text-base p-0 relative w-full z-10',
						positionToolbarAlertBanner === 'bottom' && stackAlertBanner ? '-mb-4' : '',
						alertProps.className,
					)}
					style={{
						maxWidth: `calc(${tablePaperRef.current?.clientWidth ?? 360}px - 1rem)`,
						...alertProps.style,
					}}
				>
					{renderToolbarAlertBannerContent?.({
						groupedAlert,
						selectedAlert,
						table,
					}) ?? (
						<>
							{alertProps?.title && <AlertTitle>{alertProps.title}</AlertTitle>}
							<div
								className={cn(
									'p-2 sm:p-4',
									density === 'spacious'
										? 'p-3 sm:p-5'
										: density === 'comfortable'
											? 'p-2 sm:p-3'
											: 'p-1 sm:p-2',
								)}
							>
								{alertProps?.children}
								{alertProps?.children && (selectedAlert || groupedAlert) && <br />}
								<div className="flex">
									{enableRowSelection &&
										enableSelectAll &&
										positionToolbarAlertBanner === 'head-overlay' && (
											<SRT_SelectCheckbox table={table} />
										)}{' '}
									{selectedAlert}
								</div>
								{selectedAlert && groupedAlert && <br />}
								{groupedAlert}
							</div>
						</>
					)}
				</Alert>
			</CollapsibleContent>
		</Collapsible>
	)
}
