import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { SRT_RowData, SRT_TableInstance, ButtonProps } from '@/types-SRT'

export interface SRT_ToggleFullScreenButtonProps<TData extends SRT_RowData> extends ButtonProps {
	table: SRT_TableInstance<TData>
}

export const SRT_ToggleFullScreenButton = <TData extends SRT_RowData>({
	table,
	...rest
}: SRT_ToggleFullScreenButtonProps<TData>) => {
	const {
		getState,
		options: {
			icons: { FullscreenExitIcon, FullscreenIcon },
			localization,
		},
		setIsFullScreen,
	} = table
	const { isFullScreen } = getState()

	const [tooltipOpened, setTooltipOpened] = useState(false)

	const handleToggleFullScreen = () => {
		setTooltipOpened(false)
		setIsFullScreen(!isFullScreen)
	}

	return (
		<Tooltip open={tooltipOpened} onOpenChange={setTooltipOpened}>
			<TooltipTrigger asChild>
				<Button
					aria-label={localization.toggleFullScreen}
					onClick={handleToggleFullScreen}
					variant="ghost"
					size="icon"
					{...rest}
				>
					{isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{rest?.title ?? localization.toggleFullScreen}</TooltipContent>
		</Tooltip>
	)
}
