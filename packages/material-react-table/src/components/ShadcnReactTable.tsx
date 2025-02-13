import { useShadcnReactTable } from '../hooks/useShadcnReactTable'
import type { SRT_RowData, SRT_TableInstance, SRT_TableOptions, Xor } from '../types-SRT'
import { SRT_TablePaper } from './table/SRT_TablePaper'

type TableInstanceProp<TData extends SRT_RowData> = {
	table: SRT_TableInstance<TData>
}

export type ShadcnReactTableProps<TData extends SRT_RowData> = Xor<TableInstanceProp<TData>, SRT_TableOptions<TData>>

const isTableInstanceProp = <TData extends SRT_RowData>(
	props: ShadcnReactTableProps<TData>,
): props is TableInstanceProp<TData> => (props as TableInstanceProp<TData>).table !== undefined

export const ShadcnReactTable = <TData extends SRT_RowData>(props: ShadcnReactTableProps<TData>) => {
	let table: SRT_TableInstance<TData>

	if (isTableInstanceProp(props)) {
		table = props.table
	} else {
		table = useShadcnReactTable(props)
	}

	return <SRT_TablePaper table={table} />
}
