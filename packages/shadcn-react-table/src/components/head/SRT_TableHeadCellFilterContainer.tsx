import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import type { SRT_Header, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { getColumnFilterInfo } from '../../utils/column.utils'
import { SRT_FilterCheckbox } from '../inputs/SRT_FilterCheckbox'
import { SRT_FilterRangeFields } from '../inputs/SRT_FilterRangeFields'
import { SRT_FilterRangeSlider } from '../inputs/SRT_FilterRangeSlider'
import { SRT_FilterTextField } from '../inputs/SRT_FilterTextField'

export interface SRT_TableHeadCellFilterContainerProps<TData extends SRT_RowData> {
	header: SRT_Header<TData>
	table: SRT_TableInstance<TData>
}

// wraps filter components in a collapsible component
export const SRT_TableHeadCellFilterContainer = <TData extends SRT_RowData>({
	header,
	table,
}: SRT_TableHeadCellFilterContainerProps<TData>) => {
	const {
		getState,
		options: { columnFilterDisplayMode },
	} = table
	const { showColumnFilters } = getState()
	const { column } = header
	const { columnDef } = column
	const { isRangeFilter } = getColumnFilterInfo({ header, table })

	const shouldShowFilters = showColumnFilters || columnFilterDisplayMode === 'popover'

	return (
		<Collapsible open={shouldShowFilters}>
			<CollapsibleContent>
				{columnDef.filterVariant === 'checkbox' ? (
					<SRT_FilterCheckbox column={column} table={table} />
				) : columnDef.filterVariant === 'range-slider' ? (
					<SRT_FilterRangeSlider header={header} table={table} />
				) : isRangeFilter ? (
					<SRT_FilterRangeFields header={header} table={table} />
				) : (
					<SRT_FilterTextField header={header} table={table} />
				)}
			</CollapsibleContent>
		</Collapsible>
	)
}
