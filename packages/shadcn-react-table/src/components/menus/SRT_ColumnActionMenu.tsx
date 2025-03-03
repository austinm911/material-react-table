import { type MouseEvent, useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SRT_ActionMenuItem } from './SRT_ActionMenuItem'
import { SRT_FilterOptionMenu } from './SRT_FilterOptionMenu'
import type { DropdownMenuProps, SRT_Header, SRT_RowData, SRT_TableInstance } from '../../types-SRT'

export interface SRT_ColumnActionMenuProps<TData extends SRT_RowData> extends Partial<DropdownMenuProps> {
	anchorEl: HTMLElement | null
	header: SRT_Header<TData>
	setAnchorEl: (anchorEl: HTMLElement | null) => void
	table: SRT_TableInstance<TData>
}

export const SRT_ColumnActionMenu = <TData extends SRT_RowData>({
	anchorEl,
	header,
	setAnchorEl,
	table,
	...rest
}: SRT_ColumnActionMenuProps<TData>) => {
	const { menuProps, triggerProps, contentProps } = rest
	const {
		getAllLeafColumns,
		getState,
		options: {
			columnFilterDisplayMode,
			columnFilterModeOptions,
			enableColumnFilterModes,
			enableColumnFilters,
			enableColumnPinning,
			enableColumnResizing,
			enableGrouping,
			enableHiding,
			enableSorting,
			enableSortingRemoval,
			icons: {
				XIcon,
				PanelBottomDashedIcon,
				FilterListIcon,
				FilterListOffIcon,
				PushPinIcon,
				RestartAltIcon,
				ArrowUpDownIcon,
				ViewColumnIcon,
				VisibilityOffIcon,
			},
			localization,
			renderColumnActionsMenuItems,
		},
		refs: { filterInputRefs },
		setColumnFilterFns,
		setColumnOrder,
		setColumnSizingInfo,
		setShowColumnFilters,
	} = table
	const { column } = header
	const { columnDef } = column
	const { columnSizing, columnVisibility, density, showColumnFilters } = getState()
	const columnFilterValue = column.getFilterValue()

	const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState<HTMLElement | null>(null)

	const handleClearSort = () => {
		column.clearSorting()
		setAnchorEl(null)
	}

	const handleSortAsc = () => {
		column.toggleSorting(false)
		setAnchorEl(null)
	}

	const handleSortDesc = () => {
		column.toggleSorting(true)
		setAnchorEl(null)
	}

	const handleResetColumnSize = () => {
		setColumnSizingInfo((old) => ({ ...old, isResizingColumn: false }))
		column.resetSize()
		setAnchorEl(null)
	}

	const handleHideColumn = () => {
		column.toggleVisibility(false)
		setAnchorEl(null)
	}

	const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
		column.pin(pinDirection)
		setAnchorEl(null)
	}

	const handleGroupByColumn = () => {
		column.toggleGrouping()
		setColumnOrder((old: any) => ['srt-row-expand', ...old])
		setAnchorEl(null)
	}

	const handleClearFilter = () => {
		column.setFilterValue(undefined)
		setAnchorEl(null)
		if (['empty', 'notEmpty'].includes(columnDef._filterFn)) {
			setColumnFilterFns((prev) => ({
				...prev,
				[header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
			}))
		}
	}

	const handleFilterByColumn = () => {
		setShowColumnFilters(true)
		queueMicrotask(() => filterInputRefs.current?.[`${column.id}-0`]?.focus())
		setAnchorEl(null)
	}

	const handleShowAllColumns = () => {
		for (const col of getAllLeafColumns()) {
			if (col.columnDef.enableHiding !== false) {
				col.toggleVisibility(true)
			}
		}
		setAnchorEl(null)
	}

	const handleOpenFilterModeMenu = (event: MouseEvent<HTMLElement>) => {
		event.stopPropagation()
		setFilterMenuAnchorEl(event.currentTarget)
	}

	const isSelectFilter = !!columnDef.filterSelectOptions

	const allowedColumnFilterOptions = columnDef?.columnFilterModeOptions ?? columnFilterModeOptions

	const showFilterModeSubMenu =
		enableColumnFilterModes &&
		columnDef.enableColumnFilterModes !== false &&
		!isSelectFilter &&
		(allowedColumnFilterOptions === undefined || !!allowedColumnFilterOptions?.length)

	const internalColumnMenuItems = [
		...(enableSorting && column.getCanSort()
			? [
					enableSortingRemoval !== false && (
						<SRT_ActionMenuItem
							disabled={column.getIsSorted() === false}
							icon={<XIcon />}
							key={0}
							label={localization.clearSort}
							onClick={handleClearSort}
							table={table}
						/>
					),
					<SRT_ActionMenuItem
						disabled={column.getIsSorted() === 'asc'}
						icon={<ArrowUpDownIcon style={{ transform: 'rotate(180deg) scaleX(-1)' }} />}
						key={1}
						label={localization.sortByColumnAsc?.replace('{column}', String(columnDef.header))}
						onClick={handleSortAsc}
						table={table}
					/>,
					<SRT_ActionMenuItem
						disabled={column.getIsSorted() === 'desc'}
						// 	divider={enableColumnFilters || enableGrouping || enableHiding}
						icon={<ArrowUpDownIcon />}
						key={2}
						label={localization.sortByColumnDesc?.replace('{column}', String(columnDef.header))}
						onClick={handleSortDesc}
						table={table}
					/>,
				]
			: []),
		...(enableColumnFilters && column.getCanFilter()
			? [
					<SRT_ActionMenuItem
						disabled={
							!columnFilterValue ||
							(Array.isArray(columnFilterValue) && !columnFilterValue.filter((value) => value).length)
						}
						icon={<FilterListOffIcon />}
						key={3}
						label={localization.clearFilter}
						onClick={handleClearFilter}
						table={table}
					/>,
					columnFilterDisplayMode === 'subheader' && (
						<SRT_ActionMenuItem
							disabled={showColumnFilters && !enableColumnFilterModes}
							// divider={enableGrouping || enableHiding}
							icon={<FilterListIcon />}
							key={4}
							label={localization.filterByColumn?.replace('{column}', String(columnDef.header))}
							onClick={showColumnFilters ? handleOpenFilterModeMenu : handleFilterByColumn}
							onOpenSubMenu={showFilterModeSubMenu ? handleOpenFilterModeMenu : undefined}
							table={table}
						/>
					),
					showFilterModeSubMenu && (
						<SRT_FilterOptionMenu
							anchorEl={filterMenuAnchorEl}
							header={header}
							key={5}
							onSelect={handleFilterByColumn}
							setAnchorEl={setFilterMenuAnchorEl}
							table={table}
						/>
					),
				].filter(Boolean)
			: []),
		...(enableGrouping && column.getCanGroup()
			? [
					<SRT_ActionMenuItem
						// /divider={enableColumnPinning}
						icon={<PanelBottomDashedIcon />}
						key={6}
						label={localization[column.getIsGrouped() ? 'ungroupByColumn' : 'groupByColumn']?.replace(
							'{column}',
							String(columnDef.header),
						)}
						onClick={handleGroupByColumn}
						table={table}
					/>,
				]
			: []),
		...(enableColumnPinning && column.getCanPin()
			? [
					<SRT_ActionMenuItem
						disabled={column.getIsPinned() === 'left' || !column.getCanPin()}
						icon={<PushPinIcon style={{ transform: 'rotate(90deg)' }} />}
						key={7}
						label={localization.pinToLeft}
						onClick={() => handlePinColumn('left')}
						table={table}
					/>,
					<SRT_ActionMenuItem
						disabled={column.getIsPinned() === 'right' || !column.getCanPin()}
						icon={<PushPinIcon style={{ transform: 'rotate(-90deg)' }} />}
						key={8}
						label={localization.pinToRight}
						onClick={() => handlePinColumn('right')}
						table={table}
					/>,
					<SRT_ActionMenuItem
						disabled={!column.getIsPinned()}
						// divider={enableHiding}
						icon={<PushPinIcon />}
						key={9}
						label={localization.unpin}
						onClick={() => handlePinColumn(false)}
						table={table}
					/>,
				]
			: []),
		...(enableColumnResizing && column.getCanResize()
			? [
					<SRT_ActionMenuItem
						disabled={columnSizing[column.id] === undefined}
						icon={<RestartAltIcon />}
						key={10}
						label={localization.resetColumnSize}
						onClick={handleResetColumnSize}
						table={table}
					/>,
				]
			: []),
		...(enableHiding
			? [
					<SRT_ActionMenuItem
						disabled={!column.getCanHide()}
						icon={<VisibilityOffIcon />}
						key={11}
						label={localization.hideColumn?.replace('{column}', String(columnDef.header))}
						onClick={handleHideColumn}
						table={table}
					/>,
					<SRT_ActionMenuItem
						disabled={!Object.values(columnVisibility).filter((visible) => !visible).length}
						icon={<ViewColumnIcon />}
						key={12}
						label={localization.showAllColumns?.replace('{column}', String(columnDef.header))}
						onClick={handleShowAllColumns}
						table={table}
					/>,
				]
			: []),
	].filter(Boolean)

	return (
		<DropdownMenu open={!!anchorEl} onOpenChange={() => setAnchorEl(null)} {...menuProps}>
			<DropdownMenuTrigger asChild {...triggerProps}>
				<div
					ref={(el) => {
						if (el && anchorEl) setAnchorEl(el)
					}}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent className={`${density === 'compact' ? 'py-1' : 'py-2'}`} {...contentProps}>
				{columnDef.renderColumnActionsMenuItems?.({
					closeMenu: () => setAnchorEl(null),
					column,
					internalColumnMenuItems,
					table,
				}) ??
					renderColumnActionsMenuItems?.({
						closeMenu: () => setAnchorEl(null),
						column,
						internalColumnMenuItems,
						table,
					}) ??
					internalColumnMenuItems}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
