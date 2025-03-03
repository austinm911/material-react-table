import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SRT_ShowHideColumnsMenuItems } from './SRT_ShowHideColumnsMenuItems'
import type { SRT_Column, SRT_RowData, SRT_TableInstance, DropdownMenuProps } from '../../types-SRT'
import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils'
import { cn } from '@/lib/utils'

export interface SRT_ShowHideColumnsMenuProps<TData extends SRT_RowData> extends Partial<DropdownMenuProps> {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl: (anchorEl: HTMLElement | null) => void
	table: SRT_TableInstance<TData>
}

export const SRT_ShowHideColumnsMenu = <TData extends SRT_RowData>({
	anchorEl,
	setAnchorEl,
	table,
	...rest
}: SRT_ShowHideColumnsMenuProps<TData>) => {
	const {
		getAllColumns,
		getAllLeafColumns,
		getCenterLeafColumns,
		getIsAllColumnsVisible,
		getIsSomeColumnsPinned,
		getIsSomeColumnsVisible,
		getLeftLeafColumns,
		getRightLeafColumns,
		getState,
		initialState,
		options: { enableColumnOrdering, enableColumnPinning, enableHiding, localization },
	} = table
	const { columnOrder, columnPinning, density } = getState()

	const handleToggleAllColumns = (value?: boolean) => {
		for (const col of getAllLeafColumns()) {
			if (col.columnDef.enableHiding !== false) {
				col.toggleVisibility(value)
			}
		}
	}

	const allColumns = useMemo(() => {
		const columns = getAllColumns()
		if (columnOrder.length > 0 && !columns.some((col) => col.columnDef.columnDefType === 'group')) {
			return [
				...getLeftLeafColumns(),
				...Array.from(new Set(columnOrder)).map((colId) =>
					getCenterLeafColumns().find((col) => col?.id === colId),
				),
				...getRightLeafColumns(),
			].filter(Boolean)
		}
		return columns
	}, [
		columnOrder,
		columnPinning,
		getAllColumns(),
		getCenterLeafColumns(),
		getLeftLeafColumns(),
		getRightLeafColumns(),
	]) as SRT_Column<TData>[]

	const isNestedColumns = allColumns.some((col) => col.columnDef.columnDefType === 'group')

	const hasColumnOrderChanged = useMemo(
		() =>
			columnOrder.length !== initialState.columnOrder.length ||
			!columnOrder.every((column, index) => column === initialState.columnOrder[index]),
		[columnOrder, initialState.columnOrder],
	)

	const [hoveredColumn, setHoveredColumn] = useState<SRT_Column<TData> | null>(null)

	return (
		<DropdownMenu open={!!anchorEl} onOpenChange={() => setAnchorEl(null)} {...rest}>
			<DropdownMenuTrigger asChild>
				<div onKeyDown={() => setAnchorEl(anchorEl)} />
			</DropdownMenuTrigger>
			<DropdownMenuContent className={cn('flex flex-col gap-2 p-2', density === 'compact' ? 'py-1' : 'py-2')}>
				<div className="flex justify-between gap-2">
					{enableHiding && (
						<Button
							variant="outline"
							size="sm"
							disabled={!getIsSomeColumnsVisible()}
							onClick={() => handleToggleAllColumns(false)}
						>
							{localization.hideAll}
						</Button>
					)}
					{enableColumnOrdering && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.setColumnOrder(getDefaultColumnOrderIds(table.options, true))}
							disabled={!hasColumnOrderChanged}
						>
							{localization.resetOrder}
						</Button>
					)}
					{enableColumnPinning && (
						<Button
							variant="outline"
							size="sm"
							disabled={!getIsSomeColumnsPinned()}
							onClick={() => table.resetColumnPinning(true)}
						>
							{localization.unpinAll}
						</Button>
					)}
					{enableHiding && (
						<Button
							variant="outline"
							size="sm"
							disabled={getIsAllColumnsVisible()}
							onClick={() => handleToggleAllColumns(true)}
						>
							{localization.showAll}
						</Button>
					)}
				</div>
				<Separator />
				{allColumns.map((column, index) => (
					<SRT_ShowHideColumnsMenuItems
						allColumns={allColumns}
						column={column}
						hoveredColumn={hoveredColumn}
						isNestedColumns={isNestedColumns}
						key={`${index}-${column.id}`}
						setHoveredColumn={setHoveredColumn}
						table={table}
					/>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
