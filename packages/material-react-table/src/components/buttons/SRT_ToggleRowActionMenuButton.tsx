import { type MouseEvent, useState } from 'react'
import IconButton, { type IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { SRT_EditActionButtons } from './SRT_EditActionButtons'
import type { SRT_Cell, SRT_Row, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { getCommonTooltipProps } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_RowActionMenu } from '../menus/SRT_RowActionMenu'

const commonIconButtonStyles = {
	'&:hover': {
		opacity: 1,
	},
	height: '2rem',
	ml: '10px',
	opacity: 0.5,
	transition: 'opacity 150ms',
	width: '2rem',
}

export interface SRT_ToggleRowActionMenuButtonProps<TData extends SRT_RowData> extends IconButtonProps {
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
	...rest
}: SRT_ToggleRowActionMenuButtonProps<TData>) => {
	const {
		getState,
		options: {
			createDisplayMode,
			editDisplayMode,
			enableEditing,
			icons: { EditIcon, MoreHorizIcon },
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

	return (
		<>
			{renderRowActions && !showEditActionButtons ? (
				renderRowActions({ cell, row, staticRowIndex, table })
			) : showEditActionButtons ? (
				<SRT_EditActionButtons row={row} table={table} />
			) : !renderRowActionMenuItems &&
				parseFromValuesOrFunc(enableEditing, row) &&
				['modal', 'row'].includes(editDisplayMode!) ? (
				<Tooltip placement="right" title={localization.edit}>
					<IconButton
						aria-label={localization.edit}
						onClick={handleStartEditMode}
						sx={commonIconButtonStyles}
						{...rest}
					>
						<EditIcon />
					</IconButton>
				</Tooltip>
			) : renderRowActionMenuItems?.({
					row,
					staticRowIndex,
					table,
				} as any)?.length ? (
				<>
					<Tooltip {...getCommonTooltipProps()} title={localization.rowActions}>
						<IconButton
							aria-label={localization.rowActions}
							onClick={handleOpenRowActionMenu}
							size="small"
							sx={commonIconButtonStyles}
							{...rest}
						>
							<MoreHorizIcon />
						</IconButton>
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
