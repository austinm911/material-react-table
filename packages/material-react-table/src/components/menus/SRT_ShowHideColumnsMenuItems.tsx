import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { type Dispatch, type DragEvent, type SetStateAction, useRef, useState } from 'react'
import type { DropdownMenuItemProps, SRT_Column, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { reorderColumn } from '../../utils/column.utils.shadcn'
import { SRT_ColumnPinningButtons } from '../buttons/SRT_ColumnPinningButtons'
import { SRT_GrabHandleButton } from '../buttons/SRT_GrabHandleButton'

export interface SRT_ShowHideColumnsMenuItemsProps<TData extends SRT_RowData> extends DropdownMenuItemProps {
	allColumns: SRT_Column<TData>[]
	column: SRT_Column<TData>
	hoveredColumn: SRT_Column<TData> | null
	isNestedColumns: boolean
	setHoveredColumn: Dispatch<SetStateAction<SRT_Column<TData> | null>>
	table: SRT_TableInstance<TData>
}

export const SRT_ShowHideColumnsMenuItems = <TData extends SRT_RowData>({
	allColumns,
	column,
	hoveredColumn,
	isNestedColumns,
	setHoveredColumn,
	table,
	...rest
}: SRT_ShowHideColumnsMenuItemsProps<TData>) => {
	const {
		getState,
		options: {
			enableColumnOrdering,
			enableColumnPinning,
			enableHiding,
			localization,
			shadcnTheme: { draggingBorderColor },
		},
		setColumnOrder,
	} = table
	const { columnOrder } = getState()
	const { columnDef } = column
	const { columnDefType } = columnDef

	const switchChecked = column.getIsVisible()

	const handleToggleColumnHidden = (column: SRT_Column<TData>) => {
		if (columnDefType === 'group') {
			for (const childColumn of column.columns ?? []) {
				childColumn.toggleVisibility(!switchChecked)
			}
		} else {
			column.toggleVisibility()
		}
	}

	const menuItemRef = useRef<HTMLDivElement>(null)

	const [isDragging, setIsDragging] = useState(false)

	const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
		setIsDragging(true)
		try {
			e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0)
		} catch (e) {
			console.error(e)
		}
	}

	const handleDragEnd = (_e: DragEvent<HTMLButtonElement>) => {
		setIsDragging(false)
		setHoveredColumn(null)
		if (hoveredColumn) {
			setColumnOrder(reorderColumn(column, hoveredColumn, columnOrder))
		}
	}

	const handleDragEnter = (_e: DragEvent<HTMLDivElement>) => {
		if (!isDragging && columnDef.enableColumnOrdering !== false) {
			setHoveredColumn(column)
		}
	}

	if (!columnDef.header || columnDef.visibleInShowHideMenu === false) {
		return null
	}

	return (
		<>
			<DropdownMenuItem
				ref={menuItemRef}
				{...rest}
				className={cn('flex items-center justify-start py-2 px-2 hover:bg-accent/50 cursor-pointer', {
					'opacity-50': isDragging,
					'outline-2 outline-dashed': isDragging
						? 'outline-gray-500'
						: hoveredColumn?.id === column.id
							? draggingBorderColor
							: 'outline-none',
				})}
				onDragEnter={handleDragEnter}
				style={{
					paddingLeft: `${(column.depth + 0.5) * 2}rem`,
				}}
			>
				<div className="flex flex-nowrap items-center gap-2">
					{columnDefType !== 'group' &&
						enableColumnOrdering &&
						!isNestedColumns &&
						(columnDef.enableColumnOrdering !== false ? (
							<SRT_GrabHandleButton
								onDragEnd={handleDragEnd}
								onDragStart={handleDragStart}
								table={table}
							/>
						) : (
							<div className="w-7" />
						))}
					{enableColumnPinning &&
						(column.getCanPin() ? (
							<SRT_ColumnPinningButtons column={column} table={table} />
						) : (
							<div className="w-[70px]" />
						))}
					{enableHiding ? (
						<div className="flex items-center space-x-2">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Checkbox
											checked={switchChecked}
											disabled={!column.getCanHide()}
											onCheckedChange={() => handleToggleColumnHidden(column)}
										/>
									</TooltipTrigger>
									<TooltipContent>{localization.toggleVisibility}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<Label
								className={cn('text-sm', columnDefType !== 'display' ? 'opacity-100' : 'opacity-50')}
							>
								{columnDef.header}
							</Label>
						</div>
					) : (
						<span className="self-center text-sm">{columnDef.header}</span>
					)}
				</div>
			</DropdownMenuItem>
			{column.columns?.map((c: SRT_Column<TData>, i) => (
				<SRT_ShowHideColumnsMenuItems
					allColumns={allColumns}
					column={c}
					hoveredColumn={hoveredColumn}
					isNestedColumns={isNestedColumns}
					key={`${i}-${c.id}`}
					setHoveredColumn={setHoveredColumn}
					table={table}
				/>
			))}
		</>
	)
}
