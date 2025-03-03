import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { SRT_RowData, SRT_TableInstance, ButtonProps } from '@/types-SRT'

export interface SRT_ToggleGlobalFilterButtonProps<TData extends SRT_RowData> extends ButtonProps {
	table: SRT_TableInstance<TData>
}

export const SRT_ToggleGlobalFilterButton = <TData extends SRT_RowData>({
	table,
	...rest
}: SRT_ToggleGlobalFilterButtonProps<TData>) => {
	const {
		getState,
		options: {
			icons: { SearchIcon, SearchOffIcon },
			localization,
		},
		refs: { searchInputRef },
		setShowGlobalFilter,
	} = table
	const { globalFilter, showGlobalFilter } = getState()

	const handleToggleSearch = () => {
		setShowGlobalFilter(!showGlobalFilter)
		queueMicrotask(() => searchInputRef.current?.focus())
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					aria-label={rest?.title ?? localization.showHideSearch}
					disabled={!!globalFilter}
					onClick={handleToggleSearch}
					size="icon"
					variant="ghost"
					{...rest}
					title={undefined} // title is now handled by TooltipContent
				>
					{showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{rest?.title ?? localization.showHideSearch}</TooltipContent>
		</Tooltip>
	)
}
