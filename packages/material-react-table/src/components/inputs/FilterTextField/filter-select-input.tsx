import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import MultipleSelector from '../../ui/multi-select'
import type { FilterSelectInputProps } from './types'
import type { SRT_RowData } from '../../../types-SRT'

/**
 * FilterSelectInput: A select element for simple select or multi-select filters.
 */
export function FilterSelectInput<TData extends SRT_RowData>({
	value,
	onChange,
	isMultiSelect,
	options,
	placeholder,
	ref,
	disabled = false,
	className,
	...rest
}: FilterSelectInputProps) {
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
				disabled={disabled}
				className={`w-full ${className || ''}`}
			/>
		)
	}

	return (
		<Select value={value as string} onValueChange={onChange} disabled={disabled} {...rest}>
			<SelectTrigger className={className}>
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
