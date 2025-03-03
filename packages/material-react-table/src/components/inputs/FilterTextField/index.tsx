import { type ChangeEvent, type MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { InputAdornment } from '../../ui/input-adornment'
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip'
import { SRT_FilterOptionMenu } from '../../menus/SRT_FilterOptionMenu'
import { FilterTextInput } from './filter-text-input'
import { FilterDateInput } from './filter-date-input'
import { FilterSelectInput } from './filter-select-input'
import { FilterAutocompleteInput } from './filter-autocomplete-input'
import type { SRT_FilterTextFieldProps } from './types'
import { debounce } from '../../../hooks/use-debounce'
import { getColumnFilterInfo, useDropdownOptions } from '../../../utils/column.utils.shadcn'
import { getValueAndLabel, parseFromValuesOrFunc } from '../../../utils/utils'
import type { DropdownOption, SRT_RowData } from '../../../types-SRT'

/**
 * SRT_FilterTextField: A flexible filter input that adapts based on column filter type.
 * This component handles different types of filters: text, select, date, autocomplete, etc.
 */
export const SRT_FilterTextField = <TData extends SRT_RowData>({
	header,
	rangeFilterIndex,
	table,
	...rest
}: SRT_FilterTextFieldProps<TData>) => {
	const {
		options: {
			enableColumnFilterModes,
			icons: { CloseIcon, FilterListIcon },
			localization,
			manualFiltering,
			shadcnFilterAutocompleteProps,
			shadcnFilterDatePickerProps,
			shadcnFilterDateTimePickerProps,
			shadcnFilterTextFieldProps,
			shadcnFilterTimePickerProps,
		},
		refs: { filterInputRefs },
		setColumnFilterFns,
	} = table

	const { column } = header
	const { columnDef } = column
	const { filterVariant } = columnDef

	const args = { column, rangeFilterIndex, table }

	const textFieldProps = {
		...parseFromValuesOrFunc(shadcnFilterTextFieldProps, args),
		...parseFromValuesOrFunc(columnDef.shadcnFilterTextFieldProps, args),
		...rest,
	}

	const {
		allowedColumnFilterOptions,
		currentFilterOption,
		facetedUniqueValues,
		isAutocompleteFilter,
		isDateFilter,
		isMultiSelectFilter,
		isRangeFilter,
		isSelectFilter,
		isTextboxFilter,
	} = getColumnFilterInfo({ header, table })

	const dropdownOptions = useDropdownOptions({ header, table })

	const filterChipLabel = ['empty', 'notEmpty'].includes(currentFilterOption)
		? localization[
				`filter${
					currentFilterOption?.charAt?.(0)?.toUpperCase() + currentFilterOption?.slice(1)
				}` as keyof typeof localization
			]
		: ''

	const filterPlaceholder = !isRangeFilter
		? (textFieldProps?.placeholder ?? localization.filterByColumn?.replace('{column}', String(columnDef.header)))
		: rangeFilterIndex === 0
			? localization.min
			: rangeFilterIndex === 1
				? localization.max
				: ''

	const showChangeModeButton = !!(
		enableColumnFilterModes &&
		columnDef.enableColumnFilterModes !== false &&
		!rangeFilterIndex &&
		(allowedColumnFilterOptions === undefined || !!allowedColumnFilterOptions?.length)
	)

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const [filterValue, setFilterValue] = useState<string | string[]>(() =>
		isMultiSelectFilter
			? (column.getFilterValue() as string[]) || []
			: isRangeFilter
				? (column.getFilterValue() as [string, string])?.[rangeFilterIndex as number] || ''
				: ((column.getFilterValue() as string) ?? ''),
	)
	const [autocompleteValue, setAutocompleteValue] = useState<DropdownOption | null>(
		isAutocompleteFilter ? (filterValue as DropdownOption | null) : null,
	)

	const handleChangeDebounced = useCallback(
		debounce(
			(newValue: any) => {
				if (isRangeFilter) {
					column.setFilterValue((old: Array<Date | null | number | string>) => {
						const newFilterValues = old ?? ['', '']
						newFilterValues[rangeFilterIndex as number] = newValue ?? undefined
						return newFilterValues
					})
				} else {
					column.setFilterValue(newValue ?? undefined)
				}
			},
			isTextboxFilter ? (manualFiltering ? 400 : 200) : 1,
		),
		[],
	)

	const handleChange = (newValue: any) => {
		setFilterValue(newValue ?? '')
		handleChangeDebounced(newValue)
	}

	const handleAutocompleteChange = (newValue: DropdownOption | null) => {
		setAutocompleteValue(newValue)
		handleChange(getValueAndLabel(newValue).value)
	}

	const handleClear = () => {
		if (isMultiSelectFilter) {
			setFilterValue([])
			column.setFilterValue([])
		} else if (isRangeFilter) {
			setFilterValue('')
			column.setFilterValue((old: [string | undefined, string | undefined]) => {
				const newFilterValues = (Array.isArray(old) && old) || ['', '']
				newFilterValues[rangeFilterIndex as number] = undefined
				return newFilterValues
			})
		} else {
			setFilterValue('')
			column.setFilterValue(undefined)
		}
	}

	const handleClearEmptyFilterChip = () => {
		setFilterValue('')
		column.setFilterValue(undefined)
		setColumnFilterFns((prev) => ({
			...prev,
			[header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
		}))
	}

	const handleFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const isMounted = useRef(false)

	useEffect(() => {
		if (isMounted.current) {
			const filterValue = column.getFilterValue()
			if (filterValue === undefined) {
				handleClear()
			} else if (isRangeFilter && rangeFilterIndex !== undefined) {
				setFilterValue((filterValue as [string, string])[rangeFilterIndex])
			} else {
				setFilterValue(filterValue as string)
			}
		}
		isMounted.current = true
	}, [column.getFilterValue()])

	// If columnDef.Filter is provided, use it instead
	if (columnDef.Filter) {
		return <>{columnDef.Filter?.({ column, header, rangeFilterIndex, table })}</>
	}

	// The filter element container with the filter mode button and clear button
	const FilterContainer = ({ children }: { children: React.ReactNode }) => {
		return (
			<div className="relative flex items-center">
				{showChangeModeButton && (
					<div className="flex items-center mr-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<span>
									<Button
										aria-label={localization.changeFilterMode}
										onClick={handleFilterMenuOpen}
										size="icon"
										variant="ghost"
										className="size-8"
									>
										<FilterListIcon className="size-4" />
									</Button>
								</span>
							</TooltipTrigger>
							<TooltipContent sideOffset={4} side="right">
								{localization.changeFilterMode ?? ''}
							</TooltipContent>
						</Tooltip>
						{filterChipLabel && (
							<Badge
								variant="outline"
								onClick={handleClearEmptyFilterChip}
								className="cursor-pointer ml-1"
							>
								{filterChipLabel}
							</Badge>
						)}
					</div>
				)}
				<div className="flex-grow">{children}</div>
				{showChangeModeButton && (
					<div className="mt-1 text-xs text-muted-foreground">
						<Label>
							{localization.filterMode?.replace(
								'{filterType}',
								localization[
									`filter${
										currentFilterOption?.charAt(0)?.toUpperCase() + currentFilterOption?.slice(1)
									}` as keyof typeof localization
								],
							)}
						</Label>
					</div>
				)}
			</div>
		)
	}

	// Decide which filter component to render based on filter type
	return (
		<>
			<FilterContainer>
				{isTextboxFilter && (
					<FilterTextInput
						value={filterValue as string}
						onChange={handleChange}
						placeholder={filterPlaceholder}
						ref={(inputRef) => {
							if (filterInputRefs.current) {
								filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] = inputRef
							}
						}}
						disabled={!!filterChipLabel}
					/>
				)}

				{isDateFilter && (
					<FilterDateInput
						value={filterValue as string}
						onChange={handleChange}
						placeholder={filterPlaceholder}
						filterVariant={filterVariant || ''}
						ref={(inputRef) => {
							if (filterInputRefs.current) {
								filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] = inputRef
							}
						}}
						disabled={!!filterChipLabel}
					/>
				)}

				{(isSelectFilter || isMultiSelectFilter) && (
					<FilterSelectInput
						value={
							isMultiSelectFilter
								? Array.isArray(filterValue)
									? filterValue
									: []
								: (filterValue as string)
						}
						onChange={handleChange}
						isMultiSelect={isMultiSelectFilter}
						options={
							dropdownOptions?.map((option) => {
								const { label, value } = getValueAndLabel(option)
								return {
									label: columnDef.filterSelectOptions
										? label
										: `${label} (${facetedUniqueValues.get(value)})`,
									value,
								}
							}) || []
						}
						placeholder={filterPlaceholder}
						ref={(inputRef) => {
							if (filterInputRefs.current) {
								filterInputRefs.current[`${column.id}-${rangeFilterIndex ?? 0}`] = inputRef
							}
						}}
						disabled={!!filterChipLabel}
					/>
				)}

				{isAutocompleteFilter && (
					<FilterAutocompleteInput
						value={filterValue as string}
						onChange={handleChange}
						options={dropdownOptions?.map((option) => getValueAndLabel(option)) ?? []}
						onAutocompleteValueChange={handleAutocompleteChange}
						autocompleteValue={autocompleteValue}
						placeholder={filterPlaceholder}
						disabled={!!filterChipLabel}
					/>
				)}
			</FilterContainer>

			<SRT_FilterOptionMenu
				anchorEl={anchorEl}
				header={header}
				setAnchorEl={setAnchorEl}
				setFilterValue={setFilterValue}
				table={table}
			/>
		</>
	)
}
