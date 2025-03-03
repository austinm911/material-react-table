import type { ChangeEvent } from 'react'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import type { FilterDateInputProps } from './types'

/**
 * FilterDateInput: A date/time/datetime HTML5 input to handle date-based filtering.
 */
export function FilterDateInput({
	value,
	onChange,
	placeholder,
	filterVariant,
	ref,
	disabled = false,
	className,
	...rest
}: FilterDateInputProps) {
	// Determine the HTML input type based on the filterVariant
	let inputType = 'date'
	if (filterVariant.startsWith('datetime')) {
		inputType = 'datetime-local'
	} else if (filterVariant.startsWith('time')) {
		inputType = 'time'
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}

	const handleClear = () => {
		onChange('')
	}

	return (
		<div className={`flex items-center ${className || ''}`}>
			<Input
				type={inputType}
				value={value as string}
				placeholder={placeholder}
				onChange={handleChange}
				ref={ref}
				disabled={disabled}
				className="flex-grow outline-none"
				{...rest}
			/>
			{value && !disabled && (
				<Button
					onClick={handleClear}
					aria-label="Clear filter"
					size="icon"
					variant="ghost"
					className="ml-2 text-gray-500 hover:text-gray-700 size-8"
				>
					&#x2715;
				</Button>
			)}
		</div>
	)
}
