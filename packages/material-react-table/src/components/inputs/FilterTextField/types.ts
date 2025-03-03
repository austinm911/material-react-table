import type { DropdownOption, SRT_Header, SRT_RowData, SRT_TableInstance, ButtonProps } from '../../../types-SRT'

export interface SRT_FilterTextFieldProps<TData extends SRT_RowData> extends ButtonProps {
	header: SRT_Header<TData>
	rangeFilterIndex?: number
	table: SRT_TableInstance<TData>
}

export interface FilterInputProps {
	value: string | string[]
	onChange: (value: any) => void
	placeholder?: string
	disabled?: boolean
	ref?: React.Ref<any>
	className?: string
}

export interface FilterSelectInputProps extends FilterInputProps {
	isMultiSelect?: boolean
	options: { value: string; label: string }[]
}

export interface FilterDateInputProps extends FilterInputProps {
	filterVariant: string
}

export interface FilterAutocompleteInputProps extends FilterInputProps {
	options: DropdownOption[]
	onAutocompleteValueChange: (value: DropdownOption | null) => void
	autocompleteValue: DropdownOption | null
}
