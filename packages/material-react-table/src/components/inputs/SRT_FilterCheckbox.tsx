import type { SRT_Column, SRT_RowData, SRT_TableInstance, CheckboxProps } from '@/types-SRT'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { parseFromValuesOrFunc } from '@/utils/utils'
import { cn } from '@/lib/utils'

export interface SRT_FilterCheckboxProps<TData extends SRT_RowData> extends CheckboxProps {
	column: SRT_Column<TData>
	table: SRT_TableInstance<TData>
	onChange?: (checked: boolean) => void
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
	checkboxProps?: CheckboxProps
}

export const SRT_FilterCheckbox = <TData extends SRT_RowData>({
	column,
	table,
	onChange,
	className,
	onClick,
	checkboxProps: props,
}: SRT_FilterCheckboxProps<TData>) => {
	const {
		getState,
		options: { localization, shadcnFilterCheckboxProps: muiFilterCheckboxProps },
	} = table
	const { density } = getState()
	const { columnDef } = column

	const checkboxProps = {
		...parseFromValuesOrFunc(muiFilterCheckboxProps, { column, table }),
		...parseFromValuesOrFunc(columnDef.shadcnFilterCheckboxProps, {
			column,
			table,
		}),
		...props,
	}

	const filterLabel = localization.filterByColumn?.replace('{column}', columnDef.header) ?? ''

	const currentFilterValue = column.getFilterValue()
	const checked = currentFilterValue === 'true'

	// Toggle filter value: undefined -> 'true' -> 'false' -> undefined ...
	const handleChange = (checked: boolean | 'indeterminate') => {
		const newValue = currentFilterValue === undefined ? 'true' : currentFilterValue === 'true' ? 'false' : undefined
		column.setFilterValue(newValue)
		onChange?.(checked as boolean)
	}

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()
		onClick?.(e)
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Checkbox
					checked={currentFilterValue === 'true'}
					className={cn(className)}
					onCheckedChange={handleChange}
					onClick={handleClick}
					{...checkboxProps}
				/>
			</TooltipTrigger>
			<TooltipContent>{checkboxProps.title ?? filterLabel}</TooltipContent>
		</Tooltip>
	)
}
