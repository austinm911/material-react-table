import { type MouseEvent, useState } from 'react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
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

	const handleCopy = (event: MouseEvent<HTMLButtonElement>, text: unknown) => {
		event.stopPropagation()
		navigator.clipboard.writeText(text as string)
		setCopied(true)
		setTimeout(() => setCopied(false), 4000)
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
		<Tooltip>
			<TooltipTrigger asChild>
				<Button onClick={(e) => handleCopy(e, cell.getValue())} {...buttonProps}>
					{buttonProps.children}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="top">{tooltipContent}</TooltipContent>
		</Tooltip>
	)
}
