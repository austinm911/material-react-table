import { type MouseEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { ButtonProps, SRT_RowData, SRT_TableInstance } from '@/types-SRT'
import { SRT_ShowHideColumnsMenu } from '../menus/SRT_ShowHideColumnsMenu'

export interface SRT_ShowHideColumnsButtonProps<TData extends SRT_RowData> extends ButtonProps {
	table: SRT_TableInstance<TData>
}

export const SRT_ShowHideColumnsButton = <TData extends SRT_RowData>({
	table,
	...rest
}: SRT_ShowHideColumnsButtonProps<TData>) => {
	const {
		options: {
			icons: { ViewColumnIcon },
			localization,
		},
	} = table

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						aria-label={localization.showHideColumns}
						onClick={handleClick}
						{...rest}
					>
						<ViewColumnIcon className="size-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>{rest?.title ?? localization.showHideColumns}</TooltipContent>
			</Tooltip>
			{anchorEl && <SRT_ShowHideColumnsMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} table={table} />}
		</>
	)
}
