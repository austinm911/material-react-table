import type { ButtonProps, SRT_Row, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_RowPinButton } from '../buttons/SRT_RowPinButton'

// Duplicate of MRT_TableBodyRowPinButton with SRT_ prefix
export interface SRT_TableBodyRowPinButtonProps<TData extends SRT_RowData> extends ButtonProps {
	row: SRT_Row<TData>
	table: SRT_TableInstance<TData>
}

export const SRT_TableBodyRowPinButton = <TData extends SRT_RowData>({
	row,
	table,
	...rest
}: SRT_TableBodyRowPinButtonProps<TData>) => {
	const {
		options: { enableRowPinning, rowPinningDisplayMode },
	} = table
	const canPin = parseFromValuesOrFunc(enableRowPinning, row)
	if (!canPin) return null

	const rowPinButtonProps = { row, table, ...rest }

	if (rowPinningDisplayMode === 'top-and-bottom' && !row.getIsPinned()) {
		return (
			<div className={`flex ${table.getState().density === 'compact' ? 'flex-row' : 'flex-col'}`}>
				<SRT_RowPinButton pinningPosition="top" {...rowPinButtonProps} />
				<SRT_RowPinButton pinningPosition="bottom" {...rowPinButtonProps} />
			</div>
		)
	}

	return (
		<SRT_RowPinButton
			pinningPosition={rowPinningDisplayMode === 'bottom' ? 'bottom' : 'top'}
			{...rowPinButtonProps}
		/>
	)
}
