import type { DragEventHandler } from 'react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import type { SRT_RowData, SRT_TableInstance, ButtonProps } from '../../types-SRT'
import { cn } from '@/lib/utils'

export interface SRT_GrabHandleButtonProps<TData extends SRT_RowData> extends ButtonProps {
	location?: 'column' | 'row'
	onDragEnd: DragEventHandler<HTMLButtonElement>
	onDragStart: DragEventHandler<HTMLButtonElement>
	table: SRT_TableInstance<TData>
}

export const SRT_GrabHandleButton = <TData extends SRT_RowData>({
	className,
	location,
	table,
	title,
	...rest
}: SRT_GrabHandleButtonProps<TData>) => {
	const {
		options: {
			icons: { DragHandleIcon },
			localization,
		},
	} = table

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label={title ?? localization.move}
						draggable="true"
						variant="ghost"
						size="icon"
						{...rest}
						onClick={(e) => {
							e.stopPropagation()
							rest?.onClick?.(e)
						}}
						className={cn(
							// Base styles
							'm-0 -mx-1 p-0.5 transition-all duration-150',
							// Cursor styles
							'cursor-grab active:cursor-grabbing',
							// Hover styles
							'hover:bg-transparent',
							// Opacity based on location
							location === 'row' ? 'opacity-100' : 'opacity-50 hover:opacity-100',
							className,
						)}
					>
						<DragHandleIcon />
					</Button>
				</TooltipTrigger>
				<TooltipContent side="top" align="center">
					<p>{title ?? localization.move}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
