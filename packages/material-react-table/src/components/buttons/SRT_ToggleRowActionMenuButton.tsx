import { type MouseEvent, useState } from 'react'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import type { SRT_Cell, SRT_Row, SRT_RowData, SRT_TableInstance, ButtonProps } from '../../types-SRT'
import { SRT_EditActionButtons } from './SRT_EditActionButtons'
import { SRT_RowActionMenu } from '../menus/SRT_RowActionMenu'
import { parseFromValuesOrFunc } from '../../utils/utils'

export interface SRT_ToggleRowActionMenuButtonProps<TData extends SRT_RowData> extends ButtonProps {
	cell: SRT_Cell<TData>
	row: SRT_Row<TData>
	staticRowIndex?: number
	table: SRT_TableInstance<TData>
}

export const SRT_ToggleRowActionMenuButton = <TData extends SRT_RowData>({
	cell,
	row,
	staticRowIndex,
	table,
	className,
	...rest
}: SRT_ToggleRowActionMenuButtonProps<TData>) => {
	const {
		getState,
		options: {
			createDisplayMode,
			editDisplayMode,
			enableEditing,
			icons: { EditIcon, MoreHorizontalIcon },
			localization,
			renderRowActionMenuItems,
			renderRowActions,
		},
		setEditingRow,
	} = table

	const { creatingRow, editingRow } = getState()

	const isCreating = creatingRow?.id === row.id
	const isEditing = editingRow?.id === row.id

	const showEditActionButtons =
		(isCreating && createDisplayMode === 'row') || (isEditing && editDisplayMode === 'row')

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

	const handleOpenRowActionMenu = (event: MouseEvent<HTMLElement>) => {
		event.stopPropagation()
		event.preventDefault()
		setAnchorEl(event.currentTarget)
	}

	const handleStartEditMode = (event: MouseEvent) => {
		event.stopPropagation()
		setEditingRow({ ...row })
		setAnchorEl(null)
	}

	// Tailwind-inspired opacity and hover styles to mimic the original MUI behavior
	const commonButtonClasses = 'opacity-50 hover:opacity-100 transition-opacity duration-150'

	return (
		<>
			{renderRowActions && !showEditActionButtons ? (
				renderRowActions({ cell, row, staticRowIndex, table })
			) : showEditActionButtons ? (
				<SRT_EditActionButtons row={row} table={table} />
			) : !renderRowActionMenuItems &&
				parseFromValuesOrFunc(enableEditing, row) &&
				['modal', 'row'].includes(editDisplayMode ?? '') ? (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							aria-label={localization.edit}
							onClick={handleStartEditMode}
							className={`${commonButtonClasses} ${className}`}
							{...rest}
						>
							<EditIcon className="size-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>{localization.edit}</TooltipContent>
				</Tooltip>
			) : renderRowActionMenuItems?.({
					row,
					staticRowIndex,
					table,
				} as any)?.length ? (
				<>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								aria-label={localization.rowActions}
								onClick={handleOpenRowActionMenu}
								className={`${commonButtonClasses} ${className}`}
								{...rest}
							>
								<MoreHorizontalIcon className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>{localization.rowActions}</TooltipContent>
					</Tooltip>
					<SRT_RowActionMenu
						anchorEl={anchorEl}
						handleEdit={handleStartEditMode}
						row={row}
						setAnchorEl={setAnchorEl}
						staticRowIndex={staticRowIndex}
						table={table}
					/>
				</>
			) : null}
		</>
	)
}
