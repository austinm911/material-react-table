import { useMemo } from 'react'
import { useSRT_ColumnVirtualizer } from '../../hooks/useSRT_ColumnVirtualizer'
import type { SRT_RowData, SRT_TableInstance, TableProps } from '../../types-SRT'
import { parseCSSVarId } from '../../utils/style.utils.shadcn'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_TableBody, Memo_SRT_TableBody } from '../body/SRT_TableBody'
import { SRT_TableFooter } from '../footer/SRT_TableFooter'
import { SRT_TableHead } from '../head/SRT_TableHead'
import { Table } from '../ui/table'
import { cn } from '@/lib/utils'

// Renamed interface to SRT_TableProps
export interface SRT_TableProps<TData extends SRT_RowData> extends TableProps {
	table: SRT_TableInstance<TData>
}

// Renamed export to SRT_Table
export const SRT_Table = <TData extends SRT_RowData>({ table, ...rest }: SRT_TableProps<TData>) => {
	const {
		getFlatHeaders,
		getState,
		options: {
			columns,
			enableStickyHeader,
			enableTableFooter,
			enableTableHead,
			layoutMode,
			memoMode,
			shadcnTableProps,
			renderCaption,
		},
	} = table
	const { columnSizing, columnSizingInfo, columnVisibility, isFullScreen } = getState()

	const tableProps = {
		...parseFromValuesOrFunc(shadcnTableProps, { table }),
		...rest,
	}

	const Caption = parseFromValuesOrFunc(renderCaption, { table })

	const columnSizeVars = useMemo(() => {
		const headers = getFlatHeaders()
		const colSizes: { [key: string]: number } = {}
		for (let i = 0; i < headers.length; i++) {
			const header = headers[i]
			const colSize = header.getSize()
			colSizes[`--header-${parseCSSVarId(header.id)}-size`] = colSize
			colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize
		}
		return colSizes
	}, [columns, columnSizing, columnSizingInfo, columnVisibility])

	const columnVirtualizer = useSRT_ColumnVirtualizer(table)

	const commonTableGroupProps = {
		columnVirtualizer,
		table,
	}

	return (
		<Table
			// TODO: handle sticky header
			// stickyHeader={enableStickyHeader || isFullScreen}
			{...tableProps}
			style={{ ...columnSizeVars, ...tableProps?.style }}
			className={cn(
				'border-collapse-separate',
				layoutMode?.startsWith('grid') ? 'display-grid' : '',
				'relative',
				tableProps.className,
			)}
		>
			{!!Caption && <caption>{Caption}</caption>}
			{enableTableHead && <SRT_TableHead {...commonTableGroupProps} />}
			{memoMode === 'table-body' || columnSizingInfo.isResizingColumn ? (
				<Memo_SRT_TableBody {...commonTableGroupProps} />
			) : (
				<SRT_TableBody {...commonTableGroupProps} />
			)}
			{enableTableFooter && <SRT_TableFooter {...commonTableGroupProps} />}
		</Table>
	)
}
