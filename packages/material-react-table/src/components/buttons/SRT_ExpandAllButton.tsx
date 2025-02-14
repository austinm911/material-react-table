import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import type { ButtonProps, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'

export interface SRT_ExpandAllButtonProps<TData extends SRT_RowData> extends ButtonProps {
	table: SRT_TableInstance<TData>
}

export const SRT_ExpandAllButton = <TData extends SRT_RowData>({ table, ...rest }: SRT_ExpandAllButtonProps<TData>) => {
	const {
		getCanSomeRowsExpand,
		getIsAllRowsExpanded,
		getIsSomeRowsExpanded,
		getState,
		options: {
			icons: { KeyboardDoubleArrowDownIcon },
			localization,
			shadcnExpandAllButtonProps,
			renderDetailPanel,
		},
		toggleAllRowsExpanded,
	} = table
	const { density, isLoading } = getState()

	const isAllRowsExpanded = getIsAllRowsExpanded()

	// Merge props from various sources, giving precedence to `rest` props
	const buttonProps = {
		...parseFromValuesOrFunc(shadcnExpandAllButtonProps, { table }),
		'aria-label': localization.expandAll,
		disabled: isLoading || (!renderDetailPanel && !getCanSomeRowsExpand()),
		onClick: () => toggleAllRowsExpanded(!isAllRowsExpanded),
		// Cast to valid size option
		size: density === 'compact' ? ('icon' as const) : ('sm' as const), // Adjust size based on density.
		...rest,
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button {...buttonProps}>
					{buttonProps?.children ?? (
						<KeyboardDoubleArrowDownIcon
							style={{
								transform: `rotate(${isAllRowsExpanded ? -180 : getIsSomeRowsExpanded() ? -90 : 0}deg)`,
								transition: 'transform 150ms',
							}}
						/>
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				{buttonProps?.title ?? (isAllRowsExpanded ? localization.collapseAll : localization.expandAll)}
			</TooltipContent>
		</Tooltip>
	)
}
