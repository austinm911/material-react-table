import type { MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { ButtonProps, SRT_Row, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SRT_ExpandButtonProps<TData extends SRT_RowData> extends ButtonProps {
	row: SRT_Row<TData>
	staticRowIndex?: number
	table: SRT_TableInstance<TData>
}

export const SRT_ExpandButton = <TData extends SRT_RowData>({
	row,
	staticRowIndex,
	table,
	...props
}: SRT_ExpandButtonProps<TData>) => {
	const {
		getState,
		options: { localization, shadcnExpandButtonProps, positionExpandColumn, renderDetailPanel },
	} = table
	const { density } = getState()

	const buttonProps = parseFromValuesOrFunc(shadcnExpandButtonProps, {
		row,
		staticRowIndex,
		table,
	})

	const canExpand = row.getCanExpand()
	const isExpanded = row.getIsExpanded()

	const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()
		row.toggleExpanded()
		buttonProps?.onClick?.(event)
	}

	const detailPanel = !!renderDetailPanel?.({ row, table })

	return (
		<TooltipProvider>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						aria-label={localization.expand}
						disabled={!canExpand && !detailPanel}
						{...buttonProps}
						{...props}
						onClick={handleToggleExpand}
						className={cn(
							'h-8 w-8 p-1',
							density === 'compact' ? 'h-7 w-7' : 'h-9 w-9',
							!canExpand && !detailPanel && 'opacity-30',
							buttonProps?.className,
							props.className,
						)}
						style={{
							marginLeft: positionExpandColumn === 'last' ? undefined : `${row.depth * 16}px`,
							marginRight: positionExpandColumn === 'last' ? `${row.depth * 16}px` : undefined,
						}}
					>
						{buttonProps?.children ?? (
							<ChevronDownIcon
								className="h-full w-full"
								style={{
									transform: `rotate(${
										!canExpand && !renderDetailPanel
											? positionExpandColumn === 'last'
												? 90
												: -90
											: isExpanded
												? -180
												: 0
									}deg)`,
									transition: 'transform 150ms',
								}}
							/>
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					{buttonProps?.title ?? (isExpanded ? localization.collapse : localization.expand)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
