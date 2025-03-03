import type React from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { ChevronDown, ArrowDownUp } from 'lucide-react'
import type { SRT_Header, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { Button } from '../ui/button'

export interface SRT_TableHeadCellSortLabelProps<TData extends SRT_RowData> extends React.ComponentProps<'button'> {
	header: SRT_Header<TData>
	table: SRT_TableInstance<TData>
}

export const SRT_TableHeadCellSortLabel = <TData extends SRT_RowData>({
	header,
	table,
	className,
	...rest
}: SRT_TableHeadCellSortLabelProps<TData>) => {
	const {
		getState,
		options: { localization },
	} = table
	const { column } = header
	const { columnDef } = column
	const { isLoading, showSkeletons, sorting } = getState()

	const isSorted = !!column.getIsSorted()
	const sortDirection = column.getIsSorted()

	const sortTooltip =
		isLoading || showSkeletons
			? ''
			: column.getIsSorted()
				? column.getIsSorted() === 'desc'
					? localization.sortedByColumnDesc.replace('{column}', columnDef.header)
					: localization.sortedByColumnAsc.replace('{column}', columnDef.header)
				: column.getNextSortingOrder() === 'desc'
					? localization.sortByColumnDesc.replace('{column}', columnDef.header)
					: localization.sortByColumnAsc.replace('{column}', columnDef.header)

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label={sortTooltip}
						className={cn(
							'relative inline-flex h-6 w-6 items-center justify-center transition-opacity duration-150',
							isSorted ? 'opacity-100' : 'opacity-30 hover:opacity-100',
							className,
						)}
						onClick={(e) => {
							e.stopPropagation()
							header.column.getToggleSortingHandler()?.(e)
						}}
						{...rest}
					>
						{sorting.length > 1 && column.getSortIndex() !== -1 && (
							<Badge
								className="absolute -right-1 -top-1 z-10 flex h-3 w-3 items-center justify-center rounded-full p-0 text-[10px]"
								variant="default"
							>
								{column.getSortIndex() + 1}
							</Badge>
						)}
						{!isSorted ? (
							<ArrowDownUp
								className="size-3.5 rotate-0 scale-90 transition-transform"
								strokeWidth={2.5}
							/>
						) : (
							<ChevronDown
								className={cn(
									'size-4 transition-transform',
									sortDirection === 'desc' ? 'rotate-0' : 'rotate-180',
								)}
								strokeWidth={3}
							/>
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>{sortTooltip}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
