import { SRT_ActionMenuItem } from './SRT_ActionMenuItem'
import type { SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { openEditingCell } from '../../utils/cell.utils.shadcn'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'

export interface SRT_CellActionMenuProps<TData extends SRT_RowData> {
	table: SRT_TableInstance<TData>
}

export const SRT_CellActionMenu = <TData extends SRT_RowData>({ table }: SRT_CellActionMenuProps<TData>) => {
	const {
		getState,
		options: {
			editDisplayMode,
			enableClickToCopy,
			enableEditing,
			icons: { ContentCopy, EditIcon },
			localization,
			renderCellActionMenuItems,
		},
		refs: { actionCellRef },
	} = table
	const { actionCell, density } = getState()
	const cell = actionCell!
	const { row } = cell
	const { column } = cell
	const { columnDef } = column

	const handleClose = (event?: any) => {
		event?.stopPropagation()
		table.setActionCell(null)
		actionCellRef.current = null
	}

	const internalMenuItems = [
		(parseFromValuesOrFunc(enableClickToCopy, cell) === 'context-menu' ||
			parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === 'context-menu') && (
			<SRT_ActionMenuItem
				icon={<ContentCopy />}
				key={'srt-copy'}
				label={localization.copy}
				onClick={(event) => {
					event.stopPropagation()
					navigator.clipboard.writeText(cell.getValue() as string)
					handleClose()
				}}
				table={table}
			/>
		),
		parseFromValuesOrFunc(enableEditing, row) && editDisplayMode === 'cell' && (
			<SRT_ActionMenuItem
				icon={<EditIcon />}
				key={'srt-edit'}
				label={localization.edit}
				onClick={() => {
					openEditingCell({ cell, table })
					handleClose()
				}}
				table={table}
			/>
		),
	].filter(Boolean)

	const renderActionProps = {
		cell,
		closeMenu: handleClose,
		column,
		internalMenuItems,
		row,
		table,
	}

	const menuItems =
		columnDef.renderCellActionMenuItems?.(renderActionProps) ?? renderCellActionMenuItems?.(renderActionProps)

	return (
		(!!menuItems?.length || !!internalMenuItems?.length) && (
			<DropdownMenu open={!!cell} onOpenChange={() => handleClose()}>
				<DropdownMenuTrigger asChild>
					<div ref={actionCellRef} />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					className={density === 'compact' ? 'py-1' : 'py-2'}
					onClick={(event) => event.stopPropagation()}
				>
					{menuItems ?? internalMenuItems}
				</DropdownMenuContent>
			</DropdownMenu>
		)
	)
}
