'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { DateRange } from 'react-day-picker'

// DatePicker component supporting single and range date selection modes
export type DatePickerProps = Omit<React.ComponentProps<typeof Popover>, 'children'> & {
	calendarProps?: Omit<React.ComponentProps<typeof Calendar>, 'onSelect'>
}

// FIXME: fix props in Calendar

export function DatePicker({ calendarProps, ...popoverProps }: DatePickerProps) {
	// Determine picker mode by checking calendarProps.mode (default to 'single')
	const pickerMode = calendarProps?.mode === 'range' ? 'range' : 'single'
	// State to hold either a single Date or a DateRange
	const [selectedValue, setSelectedValue] = React.useState<Date | DateRange | undefined>(undefined)

	// Remove any onSelect provided in calendarProps to avoid type conflicts with our handlers
	const { selected: _selected, ...otherCalendarProps } = calendarProps ?? {}

	// Handler for single date selection; uses generic HTMLElement for event type
	const handleSelectSingle = React.useCallback(
		(
			selectedDate: Date | undefined,
			_select: Date,
			_activeModifiers: unknown,
			_event: React.MouseEvent<HTMLElement>,
		) => {
			setSelectedValue(selectedDate)
		},
		[],
	)

	// Handler for range date selection; uses generic HTMLElement for event type
	const handleSelectRange = React.useCallback(
		(
			selectedRange: DateRange | undefined,
			_selectedDay: Date,
			_activeModifiers: unknown,
			_event: React.MouseEvent<HTMLElement>,
		) => {
			setSelectedValue(selectedRange)
		},
		[],
	)

	// Render the display value in the button based on the current mode and selection
	const renderSelectedValue = () => {
		if (!selectedValue) {
			return <span>Pick a date</span>
		}
		if (pickerMode === 'range') {
			const range = selectedValue as DateRange
			return range.from && range.to
				? `${format(range.from, 'PPP')} - ${format(range.to, 'PPP')}`
				: 'Select a date range'
		}
		return format(selectedValue as Date, 'PPP')
	}

	return (
		<Popover {...popoverProps}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'w-[280px] justify-start text-left font-normal',
						!selectedValue && 'text-muted-foreground',
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{renderSelectedValue()}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				{/* Conditionally render Calendar with correct onSelect handler based on picker mode */}
				{pickerMode === 'range' ? (
					<Calendar
						mode="range"
						selected={selectedValue as DateRange | undefined}
						onSelect={handleSelectRange}
						initialFocus
						{...otherCalendarProps}
					/>
				) : (
					<Calendar
						mode="single"
						selected={selectedValue as Date | undefined}
						onSelect={handleSelectSingle}
						initialFocus
						{...otherCalendarProps}
					/>
				)}
			</PopoverContent>
		</Popover>
	)
}
