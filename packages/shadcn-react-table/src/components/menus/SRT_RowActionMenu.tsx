import { type ReactNode, useMemo, useRef } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { SRT_ActionMenuItem } from './SRT_ActionMenuItem'
import type { SRT_Row, SRT_RowData, SRT_TableInstance, DropdownMenuProps } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'

export interface SRT_RowActionMenuProps<TData extends SRT_RowData> extends Partial<DropdownMenuProps> {
	anchorEl: HTMLElement | null
	handleEdit: (event: React.MouseEvent) => void
	row: SRT_Row<TData>
	setAnchorEl: (anchorEl: HTMLElement | null) => void
	staticRowIndex?: number
	table: SRT_TableInstance<TData>
}

export const SRT_RowActionMenu = <TData extends SRT_RowData>({
	anchorEl,
	handleEdit,
	row,
	setAnchorEl,
	staticRowIndex,
	table,
}: SRT_RowActionMenuProps<TData>) => {
	const triggerRef = useRef<HTMLDivElement>(null)

	const {
		getState,
		options: {
			editDisplayMode,
			enableEditing,
			icons: { EditIcon },
			localization,
			shadcnTheme: { menuBackgroundColor },
			renderRowActionMenuItems,
		},
	} = table
	const { density } = getState()

	const menuItems = useMemo(() => {
		const items: ReactNode[] = []
		const editItem = parseFromValuesOrFunc(enableEditing, row) &&
			['modal', 'row'].includes(editDisplayMode ?? '') && (
				<SRT_ActionMenuItem
					key={'edit'}
					icon={<EditIcon />}
					label={localization.edit}
					onClick={(e: React.MouseEvent | React.KeyboardEvent) => {
						e.stopPropagation()
						if ('button' in e) {
							handleEdit(e as React.MouseEvent)
						}
					}}
					table={table}
				/>
			)
		if (editItem) items.push(editItem)
		const rowActionMenuItems = renderRowActionMenuItems?.({
			closeMenu: () => setAnchorEl(null),
			row,
			staticRowIndex,
			table,
		})
		if (rowActionMenuItems?.length) items.push(...rowActionMenuItems)
		return items
	}, [renderRowActionMenuItems, row, staticRowIndex, table])

	if (!menuItems.length) return null

	const handleTriggerClick = () => {
		if (anchorEl) {
			setAnchorEl(triggerRef.current)
		}
	}

	const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			handleTriggerClick()
		}
	}

	return (
		<DropdownMenu open={!!anchorEl} onOpenChange={() => setAnchorEl(null)}>
			<DropdownMenuTrigger asChild>
				<div
					ref={triggerRef}
					onClick={handleTriggerClick}
					onKeyDown={handleTriggerKeyDown}
					role="button"
					tabIndex={0}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className={`${density === 'compact' ? 'py-1' : 'py-2'}`}
				style={{ backgroundColor: menuBackgroundColor }}
				onClick={(event) => event.stopPropagation()}
			>
				{menuItems}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
