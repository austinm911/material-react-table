import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import type { SRT_RowData, SRT_TableInstance, ButtonProps } from '../../types-SRT'

export interface SRT_ToggleFiltersButtonProps<TData extends SRT_RowData> extends ButtonProps {
	table: SRT_TableInstance<TData>
}

export const SRT_ToggleFiltersButton = <TData extends SRT_RowData>({
	table,
	...rest
}: SRT_ToggleFiltersButtonProps<TData>) => {
	const {
		getState,
		options: {
			icons: { FilterListIcon, FilterListOffIcon },
			localization,
		},
		setShowColumnFilters,
	} = table
	const { showColumnFilters } = getState()

	const handleToggleShowFilters = () => {
		setShowColumnFilters(!showColumnFilters)
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label={localization.showHideFilters}
					onClick={handleToggleShowFilters}
				>
					{showColumnFilters ? (
						<FilterListOffIcon className="size-4" />
					) : (
						<FilterListIcon className="size-4" />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{rest?.title ?? localization.showHideFilters}</TooltipContent>
		</Tooltip>
	)
}
