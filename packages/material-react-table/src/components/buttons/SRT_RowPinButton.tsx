import { type MouseEvent, useState } from 'react'
import type { RowPinningPosition } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import type { ButtonProps, SRT_Row, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { cn } from '../../lib/utils'

export interface SRT_RowPinButtonProps<TData extends SRT_RowData> extends ButtonProps {
	pinningPosition: RowPinningPosition
	row: SRT_Row<TData>
	table: SRT_TableInstance<TData>
}

export const SRT_RowPinButton = <TData extends SRT_RowData>({
	pinningPosition,
	row,
	table,
	...rest
}: SRT_RowPinButtonProps<TData>) => {
	const {
		options: {
			icons: { CloseIcon, PushPinIcon },
			localization,
			rowPinningDisplayMode,
		},
	} = table

	const isPinned = row.getIsPinned()
	const [tooltipOpened, setTooltipOpened] = useState(false)

	const handleTogglePin = (event: MouseEvent<HTMLButtonElement>) => {
		setTooltipOpened(false)
		event.stopPropagation()
		row.pin(isPinned ? false : pinningPosition)
	}

	return (
		<Tooltip open={tooltipOpened} onOpenChange={setTooltipOpened}>
			<TooltipTrigger asChild>
				<Button
					aria-label={localization.pin}
					onClick={handleTogglePin}
					size="icon"
					variant="ghost"
					className={cn(
						'h-6 w-6',
						rest.className, //Pass other className
					)}
					{...rest}
				>
					{isPinned ? (
						<CloseIcon className="h-4 w-4" />
					) : (
						<PushPinIcon
							className={cn(
								'h-4 w-4',
								rowPinningDisplayMode === 'sticky'
									? 'rotate-[135deg]'
									: pinningPosition === 'top'
										? 'rotate-180'
										: 'rotate-0',
							)}
						/>
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{isPinned ? localization.unpin : localization.pin}</TooltipContent>
		</Tooltip>
	)
}
