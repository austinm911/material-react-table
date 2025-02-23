import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import type { ButtonProps, SRT_RowData, SRT_TableInstance } from '../../types-SRT'

export interface SRT_ToggleDensePaddingButtonProps<TData extends SRT_RowData> extends ButtonProps {
	table: SRT_TableInstance<TData>
}

export const SRT_ToggleDensePaddingButton = <TData extends SRT_RowData>({
	table,
	...rest
}: SRT_ToggleDensePaddingButtonProps<TData>) => {
	const {
		getState,
		options: {
			icons: { DensityLargeIcon, DensityMediumIcon, DensitySmallIcon },
			localization,
		},
		setDensity,
	} = table
	const { density } = getState()

	const handleToggleDensePadding = () => {
		const nextDensity = density === 'comfortable' ? 'compact' : density === 'compact' ? 'spacious' : 'comfortable'
		setDensity(nextDensity)
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label={localization.toggleDensity}
					onClick={handleToggleDensePadding}
					{...rest}
				>
					{density === 'compact' ? (
						<DensitySmallIcon className="size-4" />
					) : density === 'comfortable' ? (
						<DensityMediumIcon className="size-4" />
					) : (
						<DensityLargeIcon className="size-4" />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{rest?.title ?? localization.toggleDensity}</TooltipContent>
		</Tooltip>
	)
}
