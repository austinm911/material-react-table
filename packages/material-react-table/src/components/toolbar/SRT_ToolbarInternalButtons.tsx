import type { SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { cn } from '@/lib/utils'
import { SRT_ShowHideColumnsButton } from '../buttons/SRT_ShowHideColumnsButton'
import { SRT_ToggleDensePaddingButton } from '../buttons/SRT_ToggleDensePaddingButton'
import { SRT_ToggleFiltersButton } from '../buttons/SRT_ToggleFiltersButton'
import { SRT_ToggleFullScreenButton } from '../buttons/SRT_ToggleFullScreenButton'
import { SRT_ToggleGlobalFilterButton } from '../buttons/SRT_ToggleGlobalFilterButton'

export interface SRT_ToolbarInternalButtonsProps<TData extends SRT_RowData> extends React.ComponentProps<'div'> {
	table: SRT_TableInstance<TData>
}

export const SRT_ToolbarInternalButtons = <TData extends SRT_RowData>({
	table,
	className,
	...rest
}: SRT_ToolbarInternalButtonsProps<TData>) => {
	const {
		options: {
			columnFilterDisplayMode,
			enableColumnFilters,
			enableColumnOrdering,
			enableColumnPinning,
			enableDensityToggle,
			enableFilters,
			enableFullScreenToggle,
			enableGlobalFilter,
			enableHiding,
			initialState,
			renderToolbarInternalActions,
		},
	} = table

	return (
		<div className={cn('flex items-center z-10', 'space-x-2', className)} {...rest}>
			{renderToolbarInternalActions?.({
				table,
			}) ?? (
				<>
					{enableFilters && enableGlobalFilter && !initialState?.showGlobalFilter && (
						<SRT_ToggleGlobalFilterButton table={table} />
					)}
					{enableFilters && enableColumnFilters && columnFilterDisplayMode !== 'popover' && (
						<SRT_ToggleFiltersButton table={table} />
					)}
					{(enableHiding || enableColumnOrdering || enableColumnPinning) && (
						<SRT_ShowHideColumnsButton table={table} />
					)}
					{enableDensityToggle && <SRT_ToggleDensePaddingButton table={table} />}
					{enableFullScreenToggle && <SRT_ToggleFullScreenButton table={table} />}
				</>
			)}
		</div>
	)
}
