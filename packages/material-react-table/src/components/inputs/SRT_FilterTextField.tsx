// TODO: FIX this component

import { type ChangeEvent, type MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import MenuItem from '@mui/material/MenuItem'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import { debounce } from '@/hooks/use-debounce'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import type {
	ButtonProps,
	DropdownOption,
	InputProps,
	SelectProps,
	SRT_Header,
	SRT_RowData,
	SRT_TableInstance,
} from '../../types-SRT'
import { getColumnFilterInfo, useDropdownOptions } from '../../utils/column.utils.shadcn'
import { getValueAndLabel, parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_FilterOptionMenu } from '../menus/SRT_FilterOptionMenu'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { InputAdornment } from '../ui/input-adornment'
import { Checkbox } from '../ui/checkbox'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '../ui/select'
import MultipleSelector from '../ui/multi-select'

export interface SRT_FilterTextFieldProps<TData extends SRT_RowData> extends ButtonProps {
	header: SRT_Header<TData>
	rangeFilterIndex?: number
	table: SRT_TableInstance<TData>
}

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

	const autocompleteProps = {
		...parseFromValuesOrFunc(shadcnFilterAutocompleteProps, args),
		...parseFromValuesOrFunc(columnDef.shadcnFilterAutocompleteProps, args),
	}

	const datePickerProps = {
		...parseFromValuesOrFunc(shadcnFilterDatePickerProps, args),
		...parseFromValuesOrFunc(columnDef.shadcnFilterDatePickerProps, args),
	} as any

	const dateTimePickerProps = {
		...parseFromValuesOrFunc(shadcnFilterDateTimePickerProps, args),
		...parseFromValuesOrFunc(columnDef.shadcnFilterDateTimePickerProps, args),
	} as any

	const timePickerProps = {
		...parseFromValuesOrFunc(shadcnFilterTimePickerProps, args),
		...parseFromValuesOrFunc(columnDef.shadcnFilterTimePickerProps, args),
	} as any

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

	const handleTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
		const newValue =
			textFieldProps.type === 'date'
				? event.target.valueAsDate
				: textFieldProps.type === 'number'
					? event.target.valueAsNumber
					: event.target.value
		handleChange(newValue)
		textFieldProps?.onChange?.(event)
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

	if (columnDef.Filter) {
		return <>{columnDef.Filter?.({ column, header, rangeFilterIndex, table })}</>
	}

	const endAdornment =
		!isAutocompleteFilter && !isDateFilter && !filterChipLabel ? (
			<InputAdornment
				position="end"
				sx={{
					mr: isSelectFilter || isMultiSelectFilter ? '20px' : undefined,
					visibility: (filterValue?.length ?? 0) > 0 ? 'visible' : 'hidden',
				}}
			>
				<Tooltip>
					<TooltipTrigger asChild>
						<span>
							<Button
								aria-label={localization.clearFilter}
								disabled={!filterValue?.toString()?.length}
								onClick={handleClear}
								size="icon"
								variant="ghost"
								className="size-8"
							>
								<CloseIcon className="size-4" />
							</Button>
						</span>
					</TooltipTrigger>
					<TooltipContent sideOffset={4} side="right">
						{localization.clearFilter ?? ''}
					</TooltipContent>
				</Tooltip>
			</InputAdornment>
		) : null

	const startAdornment = showChangeModeButton ? (
		<InputAdornment startContent={filterChipLabel}>
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
				<Badge variant="outline" onClick={handleClearEmptyFilterChip} className="cursor-pointer">
					{filterChipLabel}
				</Badge>
			)}
		</InputAdornment>
	) : null

	const commonTextFieldProps: InputProps = {
		fullWidth: true,
		helperText: showChangeModeButton ? (
			<Label>
				{localization.filterMode.replace(
					'{filterType}',
					localization[
						`filter${
							currentFilterOption?.charAt(0)?.toUpperCase() + currentFilterOption?.slice(1)
						}` as keyof typeof localization
					],
				)}
			</Label>
		) : null,
		inputRef: (inputRef) => {
			filterInputRefs.current![`${column.id}-${rangeFilterIndex ?? 0}`] = inputRef
			if (textFieldProps.inputRef) {
				textFieldProps.inputRef = inputRef
			}
		},
		margin: 'none',
		placeholder: filterChipLabel || isSelectFilter || isMultiSelectFilter ? undefined : filterPlaceholder,
		variant: 'standard',
		...textFieldProps,
		slotProps: {
			...textFieldProps.slotProps,
			formHelperText: {
				sx: {
					fontSize: '0.75rem',
					lineHeight: '0.8rem',
					whiteSpace: 'nowrap',
				},
				...textFieldProps.slotProps?.formHelperText,
			},
			input: endAdornment //hack because mui looks for presence of endAdornment key instead of undefined
				? { endAdornment, startAdornment }
				: { startAdornment },
			htmlInput: {
				'aria-label': filterPlaceholder,
				autoComplete: 'off',
				disabled: !!filterChipLabel,
				sx: {
					textOverflow: 'ellipsis',
					width: filterChipLabel ? 0 : undefined,
				},
				title: filterPlaceholder,
				...textFieldProps.slotProps?.htmlInput,
			},
		},
		onKeyDown: (e) => {
			e.stopPropagation()
			textFieldProps.onKeyDown?.(e)
		},
		sx: (theme) => ({
			minWidth: isDateFilter
				? '160px'
				: enableColumnFilterModes && rangeFilterIndex === 0
					? '110px'
					: isRangeFilter
						? '100px'
						: !filterChipLabel
							? '120px'
							: 'auto',
			mx: '-2px',
			p: 0,
			width: 'calc(100% + 4px)',
			...(parseFromValuesOrFunc(textFieldProps?.sx, theme) as any),
		}),
	}

	const commonDatePickerProps = {
		onChange: (newDate: any) => {
			handleChange(newDate)
		},
		value: filterValue || null,
	}

	return (
		<>
			{filterVariant?.startsWith('time') ? (
				<TimePicker
					{...commonDatePickerProps}
					{...timePickerProps}
					slotProps={{
						field: {
							clearable: true,
							onClear: () => handleClear(),
							...timePickerProps?.slotProps?.field,
						},
						textField: {
							...commonTextFieldProps,
							...timePickerProps?.slotProps?.textField,
						},
					}}
				/>
			) : filterVariant?.startsWith('datetime') ? (
				<DateTimePicker
					{...commonDatePickerProps}
					{...dateTimePickerProps}
					slotProps={{
						field: {
							clearable: true,
							onClear: () => handleClear(),
							...dateTimePickerProps?.slotProps?.field,
						},
						textField: {
							...commonTextFieldProps,
							...dateTimePickerProps?.slotProps?.textField,
						},
					}}
				/>
			) : filterVariant?.startsWith('date') ? (
				<DatePicker
					{...commonDatePickerProps}
					{...datePickerProps}
					slotProps={{
						field: {
							clearable: true,
							onClear: () => handleClear(),
							...datePickerProps?.slotProps?.field,
						},
						textField: {
							...commonTextFieldProps,
							...datePickerProps?.slotProps?.textField,
						},
					}}
				/>
			) : isAutocompleteFilter ? (
				<Autocomplete
					freeSolo
					getOptionLabel={(option: DropdownOption) => getValueAndLabel(option).label}
					onChange={(_e, newValue) => handleAutocompleteChange(newValue as DropdownOption | null)}
					options={dropdownOptions?.map((option) => getValueAndLabel(option)) ?? []}
					{...autocompleteProps}
					renderInput={(builtinTextFieldProps: TextFieldProps) => (
						<TextField
							{...commonTextFieldProps}
							{...builtinTextFieldProps}
							slotProps={{
								...builtinTextFieldProps.slotProps,
								...commonTextFieldProps.slotProps,
								input: {
									...builtinTextFieldProps.InputProps,
									...builtinTextFieldProps.slotProps?.input,
									startAdornment:
										//@ts-expect-error
										commonTextFieldProps?.slotProps?.input?.startAdornment,
								},
								htmlInput: {
									...builtinTextFieldProps.inputProps,
									...builtinTextFieldProps.slotProps?.htmlInput,
									...commonTextFieldProps?.slotProps?.htmlInput,
								},
							}}
							onChange={handleTextFieldChange}
							onClick={(e: MouseEvent<HTMLInputElement>) => e.stopPropagation()}
						/>
					)}
					value={autocompleteValue}
				/>
			) : (
				<TextField
					select={isSelectFilter || isMultiSelectFilter}
					{...commonTextFieldProps}
					slotProps={{
						...commonTextFieldProps.slotProps,
						inputLabel: {
							shrink: isSelectFilter || isMultiSelectFilter,
							...(commonTextFieldProps.slotProps?.inputLabel as any),
						},
						select: {
							MenuProps: { disableScrollLock: true },
							displayEmpty: true,
							multiple: isMultiSelectFilter,
							renderValue: isMultiSelectFilter
								? (selected: any) =>
										!Array.isArray(selected) || selected?.length === 0 ? (
											<div className="opacity-50">{filterPlaceholder}</div>
										) : (
											<div className="flex flex-wrap gap-[2px]">
												{selected.map((value: string) => {
													const selectedValue = dropdownOptions?.find(
														(option) => getValueAndLabel(option).value === value,
													)
													return (
														<Badge key={value} variant="default">
															{getValueAndLabel(selectedValue).label}
														</Badge>
													)
												})}
											</div>
										)
								: undefined,
							...commonTextFieldProps.slotProps?.select,
						},
					}}
					onChange={handleTextFieldChange}
					onClick={(e: MouseEvent<HTMLInputElement>) => e.stopPropagation()}
					value={isMultiSelectFilter ? (Array.isArray(filterValue) ? filterValue : []) : filterValue}
				>
					{(isSelectFilter || isMultiSelectFilter) && [
						<MenuItem disabled divider hidden key="p" value="">
							<div className="opacity-50">{filterPlaceholder}</div>
						</MenuItem>,
						...[
							textFieldProps.children ??
								dropdownOptions?.map((option, index) => {
									const { label, value } = getValueAndLabel(option)
									return (
										<MenuItem
											key={`${index}-${value}`}
											sx={{
												alignItems: 'center',
												display: 'flex',
												gap: '0.5rem',
												m: 0,
											}}
											value={value}
										>
											{isMultiSelectFilter && (
												<Checkbox
													checked={((column.getFilterValue() ?? []) as string[]).includes(
														value,
													)}
													className="mr-2"
												/>
											)}
											{label}{' '}
											{!columnDef.filterSelectOptions && `(${facetedUniqueValues.get(value)})`}
										</MenuItem>
									)
								}),
						],
					]}
				</TextField>
			)}
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

/**
 * FilterTextInput: A simple text input for filtering a column.
 */
function FilterTextInput({ value, onChange, placeholder, ref, ...rest }: InputProps) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange?.(e)
	}

	const handleClear = () => {
		onChange?.({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)
	}

	return (
		<div className="flex items-center border border-gray-300 rounded px-2 py-1">
			<Input
				type="text"
				value={value}
				placeholder={placeholder}
				onChange={handleChange}
				ref={ref}
				className="flex-grow outline-none"
				{...rest}
			/>
			{value && (
				<Button
					onClick={handleClear}
					aria-label="Clear filter"
					className="ml-2 text-gray-500 hover:text-gray-700"
				>
					&#x2715;
				</Button>
			)}
		</div>
	)
}

/* -----------------------------------------------------------------------------
   FilterSelectInput
   A select element for simple select or multi-select filters.
----------------------------------------------------------------------------- */
function FilterSelectInput<TData extends SRT_RowData>({
	value,
	ref,
	isMultiSelect,
	options,
	placeholder,
	onChange,
	...rest
}: {
	value: string | string[]
	ref?: React.Ref<any>
	isMultiSelect?: boolean
	options: { value: string; label: string }[]
	placeholder?: string
	onChange: (value: string | string[]) => void
}) {
	if (isMultiSelect) {
		return (
			<MultipleSelector
				value={Array.isArray(value) ? value.map((v) => ({ value: v, label: v })) : []}
				defaultOptions={options}
				onChange={(selected) => {
					onChange(selected.map((option) => option.value))
				}}
				placeholder={placeholder}
				ref={ref}
				className="w-full"
			/>
		)
	}

	return (
		<Select {...rest}>
			<SelectTrigger>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{placeholder && <SelectItem value="">{placeholder}</SelectItem>}
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

/* -----------------------------------------------------------------------------
   FilterDateInput
   A date/time/datetime HTML5 input to handle date-based filtering.
----------------------------------------------------------------------------- */
function FilterDateInput(
	{ value, onChange, placeholder, filterVariant, ref, ...rest }: InputProps & { filterVariant: string },

	// {
	// 	value: string
	// 	onChange: (newVal: string) => void
	// 	placeholder: string
	// 	filterVariant: string
	// 	inputRef?: (node: HTMLInputElement | null) => void
	// }
) {
	let inputType = 'date'
	if (filterVariant.startsWith('datetime')) {
		inputType = 'datetime-local'
	} else if (filterVariant.startsWith('time')) {
		inputType = 'time'
	}
	return (
		<div className="flex items-center border border-gray-300 rounded px-2 py-1">
			<Input
				type={inputType}
				value={value}
				placeholder={placeholder}
				onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
				ref={ref}
				className="flex-grow outline-none"
				{...rest}
			/>
			{value && (
				<Button
					onClick={() => onChange('')}
					aria-label="Clear filter"
					className="ml-2 text-gray-500 hover:text-gray-700"
				>
					&#x2715;
				</Button>
			)}
		</div>
	)
}
