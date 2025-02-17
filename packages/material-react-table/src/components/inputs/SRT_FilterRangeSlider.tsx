import { useEffect, useRef, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { FormHelperText } from '@/components/ui/form-helper-text'
import type { SRT_Header, SRT_RowData, SRT_TableInstance, SliderProps } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'

export interface SRT_FilterRangeSliderProps<TData extends SRT_RowData> extends Omit<SliderProps, 'onChange' | 'value'> {
	header: SRT_Header<TData>
	table: SRT_TableInstance<TData>
}

export const SRT_FilterRangeSlider = <TData extends SRT_RowData>({
	header,
	table,
	...rest
}: SRT_FilterRangeSliderProps<TData>) => {
	const {
		options: { enableColumnFilterModes, localization, shadcnFilterSliderProps },
		refs: { filterInputRefs },
	} = table
	const { column } = header
	const { columnDef } = column

	const currentFilterOption = columnDef._filterFn

	const showChangeModeButton = enableColumnFilterModes && columnDef.enableColumnFilterModes !== false

	const sliderProps = {
		...parseFromValuesOrFunc(shadcnFilterSliderProps, { column, table }),
		...parseFromValuesOrFunc(columnDef.shadcnFilterSliderProps, {
			column,
			table,
		}),
		...rest,
	}

	let [min, max] =
		sliderProps.min !== undefined && sliderProps.max !== undefined
			? [sliderProps.min, sliderProps.max]
			: (column.getFacetedMinMaxValues() ?? [0, 1])

	//fix potential TanStack Table bugs where min or max is an array
	if (Array.isArray(min)) min = min[0]
	if (Array.isArray(max)) max = max[0]
	if (min === null) min = 0
	if (max === null) max = 1

	const [filterValues, setFilterValues] = useState<[number, number]>([min, max])
	const columnFilterValue = column.getFilterValue()

	const isMounted = useRef(false)

	// prevent moving the focus to the next/prev cell when using the arrow keys
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			event.stopPropagation()
		}
	}

	useEffect(() => {
		if (isMounted.current) {
			if (columnFilterValue === undefined) {
				setFilterValues([min, max])
			} else if (Array.isArray(columnFilterValue)) {
				setFilterValues(columnFilterValue as [number, number])
			}
		}
		isMounted.current = true
	}, [columnFilterValue, min, max])

	return (
		<div>
			<Slider
				className="data-[orientation=horizontal]:mt-2"
				defaultValue={[min, max]}
				max={max}
				min={min}
				onKeyDown={handleKeyDown}
				onValueChange={(values) => {
					setFilterValues(values as [number, number])
				}}
				onValueCommit={(value) => {
					if (value[0] <= min && value[1] >= max) {
						//if the user has selected the entire range, remove the filter
						column.setFilterValue(undefined)
					} else {
						column.setFilterValue(value as [number, number])
					}
				}}
				value={filterValues}
				{...sliderProps}
			/>
			{showChangeModeButton ? (
				<FormHelperText className="-mt-1">
					{localization.filterMode.replace(
						'{filterType}',
						localization[
							`filter${
								currentFilterOption?.charAt(0)?.toUpperCase() + currentFilterOption?.slice(1)
							}` as keyof typeof localization
						],
					)}
				</FormHelperText>
			) : null}
		</div>
	)
}
