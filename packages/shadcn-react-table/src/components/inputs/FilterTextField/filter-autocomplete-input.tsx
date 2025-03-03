import { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { Button } from '../../ui/button'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FilterAutocompleteInputProps } from './types'
import { getValueAndLabel } from '../../../utils/utils'

/**
 * FilterAutocompleteInput: An autocomplete component for filtering with search capabilities
 */
export function FilterAutocompleteInput({
	value,
	onChange,
	options,
	placeholder,
	onAutocompleteValueChange,
	autocompleteValue,
	disabled = false,
	className,
	...rest
}: FilterAutocompleteInputProps) {
	const [open, setOpen] = useState(false)

	// Handle text input changes
	const handleInputChange = (inputValue: string) => {
		onChange(inputValue)
	}

	// Handle selection of an autocomplete option
	const handleSelect = (currentValue: string) => {
		const selectedOption = options.find((option) => getValueAndLabel(option).value === currentValue) || null

		onAutocompleteValueChange(selectedOption)
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					disabled={disabled}
					className={cn('w-full justify-between', className)}
					onClick={() => setOpen(true)}
				>
					{autocompleteValue ? getValueAndLabel(autocompleteValue).label : placeholder || 'Select option...'}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput
						placeholder="Search..."
						value={value as string}
						onValueChange={handleInputChange}
						{...rest}
					/>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup>
						{options.map((option) => {
							const { label, value: optionValue } = getValueAndLabel(option)
							return (
								<CommandItem key={optionValue} value={optionValue} onSelect={handleSelect}>
									<CheckIcon
										className={cn(
											'mr-2 h-4 w-4',
											autocompleteValue &&
												getValueAndLabel(autocompleteValue).value === optionValue
												? 'opacity-100'
												: 'opacity-0',
										)}
									/>
									{label}
								</CommandItem>
							)
						})}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
