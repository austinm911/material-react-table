import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SRT_Column, SRT_RowData, SRT_TableInstance, ButtonProps } from '../../types-SRT'

export interface SRT_ColumnPinningButtonsProps<TData extends SRT_RowData> extends ButtonProps {
	column: SRT_Column<TData>
	table: SRT_TableInstance<TData>
	className?: string
}

/**
 * Column pinning buttons component.
 */
export const SRT_ColumnPinningButtons = <TData extends SRT_RowData>({
	column,
	table,
	className,
	...rest
}: SRT_ColumnPinningButtonsProps<TData>) => {
	const {
		options: {
			icons: { PushPinIcon },
			localization,
		},
	} = table

	const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
		column.pin(pinDirection)
	}

	const renderPinButton = (pinDirection: 'left' | 'right' | false, title: string, rotation?: number) => {
		return (
			<Tooltip key={pinDirection ? pinDirection : 'unpin'}>
				<TooltipTrigger asChild>
					<Button {...rest} variant="ghost" size="icon" onClick={() => handlePinColumn(pinDirection)}>
						<PushPinIcon style={{ transform: `rotate(${rotation}deg)` }} />
					</Button>
				</TooltipTrigger>
				<TooltipContent>{title}</TooltipContent>
			</Tooltip>
		)
	}

	return (
		<div className={cn('flex items-center justify-center gap-1', className)}>
			{column.getIsPinned() ? (
				renderPinButton(false, localization.unpin)
			) : (
				<>
					{renderPinButton('left', localization.pinToLeft, 90)}
					{renderPinButton('right', localization.pinToRight, -90)}
				</>
			)}
		</div>
	)
}
