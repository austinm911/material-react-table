import type { MouseEvent } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { CheckboxProps, SRT_Row, SRT_RowData, SRT_TableInstance } from '@/types-SRT'
import { getIsRowSelected, getSRT_RowSelectionHandler, getSRT_SelectAllHandler } from '@/utils/row.utils'
import { getCommonTooltipProps } from '@/utils/style.utils'
import { parseFromValuesOrFunc } from '@/utils/utils'

export interface SRT_SelectCheckboxProps<TData extends SRT_RowData> extends CheckboxProps {
	row?: SRT_Row<TData>
	staticRowIndex?: number
	table: SRT_TableInstance<TData>
	className?: string
}

export const SRT_SelectCheckbox = <TData extends SRT_RowData>({
	row,
	staticRowIndex,
	table,
	className,
	...props
}: SRT_SelectCheckboxProps<TData>) => {
	const {
		getState,
		options: {
			enableMultiRowSelection,
			localization,
			shadcnSelectAllCheckboxProps,
			shadcnSelectCheckboxProps,
			selectAllMode,
		},
	} = table
	const { density, isLoading } = getState()

	const selectAll = !row
	const allRowsSelected = selectAll
		? selectAllMode === 'page'
			? table.getIsAllPageRowsSelected()
			: table.getIsAllRowsSelected()
		: undefined

	const isChecked = selectAll ? allRowsSelected : getIsRowSelected({ row, table })

	const checkboxProps = {
		...(selectAll
			? parseFromValuesOrFunc(shadcnSelectAllCheckboxProps, { table })
			: parseFromValuesOrFunc(shadcnSelectCheckboxProps, {
					row,
					staticRowIndex,
					table,
				})),
	}

	const onSelectionChange = row ? getSRT_RowSelectionHandler({ row, staticRowIndex, table }) : undefined

	const onSelectAllChange = getSRT_SelectAllHandler({ table })

	const commonProps = {
		'aria-label': selectAll ? localization.toggleSelectAll : localization.toggleSelectRow,
		checked: isChecked,
		disabled: isLoading || (row && !row.getCanSelect()) || row?.id === 'srt-row-create',
		onCheckedChange: (checked: boolean) => {
			const event = { target: { checked } } as unknown as Event
			selectAll ? onSelectAllChange(event) : onSelectionChange?.(event)
		},
		onClick: (e: MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation()
			props?.onClick?.(e)
		},
		className: cn(
			'z-0',
			density === 'compact' ? 'h-7 w-7' : 'h-10 w-10',
			density !== 'compact' && '-m-1.5',
			className,
		),
	}

	return (
		<TooltipProvider {...getCommonTooltipProps().provider}>
			<Tooltip>
				<TooltipTrigger>
					{enableMultiRowSelection === false ? (
						<RadioGroup>
							<RadioGroupItem {...commonProps} value={row?.id ?? 'select-all'} />
						</RadioGroup>
					) : (
						<Checkbox
							indeterminate={
								!isChecked && selectAll
									? table.getIsSomeRowsSelected()
									: row?.getIsSomeSelected() && row.getCanSelectSubRows()
							}
							{...commonProps}
						/>
					)}
				</TooltipTrigger>
				<TooltipContent {...getCommonTooltipProps().content}>
					{checkboxProps?.title ?? (selectAll ? localization.toggleSelectAll : localization.toggleSelectRow)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
