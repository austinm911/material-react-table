import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import Stack from '@mui/material/Stack'
import type { SRT_Row, SRT_RowData, SRT_TableInstance, DialogProps } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_EditCellTextField } from '../inputs/SRT_EditCellTextField'
import { SRT_EditActionButtons } from '../buttons/SRT_EditActionButtons'
import { useCallback } from 'react'

export interface SRT_EditRowModalProps<TData extends SRT_RowData> extends Partial<DialogProps> {
	open: boolean
	table: SRT_TableInstance<TData>
}

// SRT_EditRowModal component to render the edit row modal
export const SRT_EditRowModal = <TData extends SRT_RowData>({ open, table, ...rest }: SRT_EditRowModalProps<TData>) => {
	const {
		getState,
		options: {
			localization,
			muiCreateRowModalProps,
			muiEditRowDialogProps,
			onCreatingRowCancel,
			onEditingRowCancel,
			renderCreateRowDialogContent,
			renderEditRowDialogContent,
		},
		setCreatingRow,
		setEditingRow,
	} = table
	const { creatingRow, editingRow } = getState()
	const row = (creatingRow ?? editingRow) as SRT_Row<TData>

	const dialogProps = {
		...parseFromValuesOrFunc(muiEditRowDialogProps, { row, table }),
		...(creatingRow && parseFromValuesOrFunc(muiCreateRowModalProps, { row, table })),
		...rest,
	}

	// useCallback to memoize the internal edit components
	const internalEditComponents = useCallback(
		() =>
			row
				.getAllCells()
				.filter((cell) => cell.column.columnDef.columnDefType === 'data')
				.map((cell) => (
					<SRT_EditCellTextField
						cell={cell as any} // Specify a different type
						key={cell.id}
						table={table as any} // Specify a different type
					/>
				)),
		[row, table],
	)

	// useCallback to memoize the onClose handler
	const handleClose = useCallback(
		(event: any, reason: any) => {
			if (creatingRow) {
				onCreatingRowCancel?.({ row, table })
				setCreatingRow(null)
			} else {
				onEditingRowCancel?.({ row, table })
				setEditingRow(null)
			}
			row._valuesCache = {} as any //reset values cache // Specify a different type
			dialogProps.onClose?.(event, reason)
		},
		[creatingRow, dialogProps, onCreatingRowCancel, onEditingRowCancel, row, setCreatingRow, setEditingRow, table],
	)

	return (
		<Dialog open={open} {...dialogProps}>
			<DialogContent>
				{creatingRow && renderCreateRowDialogContent ? (
					renderCreateRowDialogContent({
						internalEditComponents: internalEditComponents(),
						row,
						table,
					})
				) : editingRow && renderEditRowDialogContent ? (
					renderEditRowDialogContent({
						internalEditComponents: internalEditComponents(),
						row,
						table,
					})
				) : (
					<>
						<DialogHeader>
							<DialogTitle>{localization.edit}</DialogTitle>
							<DialogDescription>Edit row data</DialogDescription>
						</DialogHeader>
						<form onSubmit={(e) => e.preventDefault()}>
							<Stack
								sx={{
									gap: '32px',
									paddingTop: '16px',
									width: '100%',
								}}
							>
								{internalEditComponents()}
							</Stack>
						</form>
						<DialogFooter sx={{ p: '1.25rem' }}>
							<SRT_EditActionButtons row={row} table={table} variant="text" />
						</DialogFooter>
					</>
				)}
			</DialogContent>
			<DialogOverlay />
			<DialogPortal />
		</Dialog>
	)
}
