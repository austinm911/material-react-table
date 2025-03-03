import { type MouseEvent, useState } from 'react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip'
import type { ButtonProps, SRT_Cell, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'

export interface SRT_CopyButtonProps<TData extends SRT_RowData> extends ButtonProps {
	cell: SRT_Cell<TData>
	table: SRT_TableInstance<TData>
}

export const SRT_CopyButton = <TData extends SRT_RowData>({ cell, table, ...rest }: SRT_CopyButtonProps<TData>) => {
	const {
		options: { localization, shadcnCopyButtonProps },
	} = table
	const { column, row } = cell
	const { columnDef } = column

	const [copied, setCopied] = useState(false)
	const [open, setOpen] = useState(false)

	const handleCopy = (event: MouseEvent<HTMLButtonElement>, text: unknown) => {
		event.stopPropagation()
		navigator.clipboard.writeText(text as string)
		setCopied(true)
		// Keep tooltip open but update content
		setTimeout(() => {
			setCopied(false)
			setOpen(false)
		}, 2000)
	}

	// Merge additional props from table and column definition
	const buttonProps = {
		...parseFromValuesOrFunc(shadcnCopyButtonProps, { cell, column, row, table }),
		...parseFromValuesOrFunc(columnDef.shadcnCopyButtonProps, {
			cell,
			column,
			row,
			table,
		}),
		...rest,
	}

	const tooltipContent = buttonProps?.title ?? (copied ? localization.copiedToClipboard : localization.clickToCopy)

	return (
		<TooltipProvider>
			<Tooltip open={open} onOpenChange={setOpen} delayDuration={0}>
				<TooltipTrigger asChild>
					<Button
						onClick={(e) => {
							handleCopy(e, cell.getValue())
							setOpen(true)
						}}
						{...buttonProps}
					>
						{buttonProps.children}
					</Button>
				</TooltipTrigger>
				<TooltipContent side="top">{tooltipContent}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
