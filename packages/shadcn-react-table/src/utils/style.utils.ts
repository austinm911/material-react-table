import type { CSSProperties } from 'react'
import type {
	SRT_Column,
	SRT_Header,
	SRT_RowData,
	SRT_TableInstance,
	SRT_TableOptions,
	SRT_Theme,
	TableCellProps,
	TooltipContentProps,
	TooltipProps,
	TooltipProviderProps,
} from '../types-SRT'
import { parseFromValuesOrFunc } from './utils'

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_')

export const getSRTTheme = <TData extends SRT_RowData>(srtTheme: SRT_TableOptions<TData>['shadcnTheme']): SRT_Theme => {
	const srtThemeOverrides = parseFromValuesOrFunc(srtTheme, {})
	const baseBackgroundColor = srtThemeOverrides?.baseBackgroundColor ?? 'hsl(var(--background))'

	return {
		baseBackgroundColor,
		cellNavigationOutlineColor: 'hsl(var(--primary))',
		draggingBorderColor: 'hsl(var(--primary))',
		matchHighlightColor: 'hsl(var(--warning) / 0.2)',
		menuBackgroundColor: 'hsl(var(--background) / 0.9)',
		pinnedRowBackgroundColor: 'hsl(var(--primary) / 0.1)',
		selectedRowBackgroundColor: 'hsl(var(--primary) / 0.2)',
		...srtThemeOverrides,
	}
}

export const commonCellBeforeAfterStyles = {
	content: '""',
	height: '100%',
	left: 0,
	position: 'absolute',
	top: 0,
	width: '100%',
	zIndex: -1,
}

export const getCommonPinnedCellStyles = <TData extends SRT_RowData>({
	column,
	table,
}: {
	column?: SRT_Column<TData>
	table: SRT_TableInstance<TData>
}) => {
	const { baseBackgroundColor } = table.options.shadcnTheme
	const isPinned = column?.getIsPinned()

	return {
		'&[data-pinned="true"]': {
			'&:before': {
				backgroundColor: baseBackgroundColor,
				boxShadow: column
					? isPinned === 'left' && column.getIsLastColumn(isPinned)
						? '-4px 0 4px -4px hsl(var(--foreground) / 0.2) inset'
						: isPinned === 'right' && column.getIsFirstColumn(isPinned)
							? '4px 0 4px -4px hsl(var(--foreground) / 0.2) inset'
							: undefined
					: undefined,
				...commonCellBeforeAfterStyles,
			},
		},
	}
}

export const getCommonSRTCellStyles = <TData extends SRT_RowData>({
	column,
	header,
	table,
	tableCellProps,
}: {
	column: SRT_Column<TData>
	header?: SRT_Header<TData>
	table: SRT_TableInstance<TData>
	tableCellProps: TableCellProps
}) => {
	const {
		getState,
		options: { enableColumnVirtualization, layoutMode },
	} = table
	const { draggingColumn } = getState()
	const { columnDef } = column
	const { columnDefType } = columnDef

	const isColumnPinned = columnDefType !== 'group' && column.getIsPinned()

	const widthStyles: CSSProperties = {
		minWidth: `max(calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
			header?.id ?? column.id,
		)}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
		width: `calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(header?.id ?? column.id)}-size) * 1px)`,
	}

	if (layoutMode === 'grid') {
		widthStyles.flex = `${
			[0, false].includes(columnDef.grow ?? 0)
				? 0
				: `var(--${header ? 'header' : 'col'}-${parseCSSVarId(header?.id ?? column.id)}-size)`
		} 0 auto`
	} else if (layoutMode === 'grid-no-grow') {
		widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`
	}

	const pinnedStyles = isColumnPinned
		? {
				...getCommonPinnedCellStyles({ column, table }),
				left: isColumnPinned === 'left' ? `${column.getStart('left')}px` : undefined,
				opacity: 0.97,
				position: 'sticky',
				right: isColumnPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
			}
		: {}

	return {
		backgroundColor: 'inherit',
		backgroundImage: 'inherit',
		display: layoutMode?.startsWith('grid') ? 'flex' : undefined,
		justifyContent:
			columnDefType === 'group' ? 'center' : layoutMode?.startsWith('grid') ? tableCellProps.align : undefined,
		opacity:
			table.getState().draggingColumn?.id === column.id || table.getState().hoveredColumn?.id === column.id
				? 0.5
				: 1,
		position: 'relative',
		transition: enableColumnVirtualization ? 'none' : 'padding 150ms ease-in-out',
		zIndex:
			column.getIsResizing() || draggingColumn?.id === column.id
				? 2
				: columnDefType !== 'group' && isColumnPinned
					? 1
					: 0,
		'&:focus-visible': {
			outline: `2px solid ${table.options.shadcnTheme?.cellNavigationOutlineColor ?? 'hsl(var(--primary))'}`,
			outlineOffset: '-2px',
		},
		...pinnedStyles,
		...widthStyles,
		...(parseFromValuesOrFunc(tableCellProps?.className, {}) as any),
	}
}

export const getCommonToolbarStyles = <TData extends SRT_RowData>({
	table,
}: {
	table: SRT_TableInstance<TData>
}) => ({
	alignItems: 'flex-start',
	backgroundColor: table.options.shadcnTheme.baseBackgroundColor,
	display: 'grid',
	flexWrap: 'wrap-reverse',
	minHeight: '3.5rem',
	overflow: 'hidden',
	position: 'relative',
	transition: 'all 150ms ease-in-out',
	zIndex: 1,
})

export const flipIconStyles = () => undefined

// Spread the different props into the provider and content
export const getCommonTooltipProps = (
	side?: TooltipContentProps['side'],
): {
	provider: Partial<TooltipProviderProps>
	tooltip: Partial<TooltipProps>
	content: Partial<TooltipContentProps>
} => ({
	provider: {
		delayDuration: 1000,
	},
	tooltip: {},
	content: {
		side,
	},
})
