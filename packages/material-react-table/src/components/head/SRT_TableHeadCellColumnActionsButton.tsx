import { type MouseEvent, useState } from 'react'
import type { SRT_Header, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { MRT_ColumnActionMenu } from '../menus/MRT_ColumnActionMenu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

export interface SRT_TableHeadCellColumnActionsButtonProps<TData extends SRT_RowData>
	extends React.ComponentProps<'button'> {
	header: SRT_Header<TData>
	table: SRT_TableInstance<TData>
}

export const SRT_TableHeadCellColumnActionsButton = <TData extends SRT_RowData>({
	header,
	table,
	className,
	...rest
}: SRT_TableHeadCellColumnActionsButtonProps<TData>) => {
	const {
		options: {
			icons: { MoreVertIcon },
			localization,
			shadcnColumnActionsButtonProps: muiColumnActionsButtonProps,
		},
	} = table
	const { column } = header
	const { columnDef } = column

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		event.stopPropagation()
		event.preventDefault()
		setAnchorEl(event.currentTarget)
	}

	const buttonProps = {
		...parseFromValuesOrFunc(muiColumnActionsButtonProps, {
			column,
			table,
		}),
		...parseFromValuesOrFunc(columnDef.shadcnColumnActionsButtonProps, {
			column,
			table,
		}),
		...rest,
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label={buttonProps?.title ?? localization.columnActions}
						onClick={handleClick}
						variant="ghost"
						size="icon"
						{...buttonProps}
						className={cn(
							'm-0 -mx-1 h-8 w-8 transition-opacity',
							'opacity-50 hover:opacity-100',
							className,
						)}
					>
						{buttonProps?.children ?? <MoreVertIcon className="size-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom" align="center">
					<p>{buttonProps?.title ?? localization.columnActions}</p>
				</TooltipContent>
			</Tooltip>
			{anchorEl && (
				<MRT_ColumnActionMenu anchorEl={anchorEl} header={header} setAnchorEl={setAnchorEl} table={table} />
			)}
		</TooltipProvider>
	)
}
