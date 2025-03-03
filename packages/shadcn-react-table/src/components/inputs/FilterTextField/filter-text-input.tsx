import type { ChangeEvent } from 'react'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import type { FilterInputProps } from './types'

/**
 * FilterTextInput: A simple text input for filtering a column.
 */
export function FilterTextInput({
	value,
	onChange,
	placeholder,
	ref,
	disabled = false,
	className,
	...rest
}: FilterInputProps) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}

	const handleClear = () => {
		onChange('')
	}

	return (
		<div className={`flex items-center ${className || ''}`}>
			<Input
				type="text"
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
