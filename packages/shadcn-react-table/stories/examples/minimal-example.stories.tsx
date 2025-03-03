import { SRT_Table } from '@/components/table/SRT_Table'
import { useShadcnReactTable } from '@/hooks/useShadcnReactTable'
import type { SRT_ColumnDef } from '@/types-SRT'
import type { Meta } from '@storybook/react'
import { useMemo } from 'react'
import { type Person, columns, createPersonData } from '../mock'

const meta: Meta = {
	title: 'Examples/Minimal Example',
}

export default meta

const data = createPersonData(7)

export function Example() {
	const tableCols = useMemo<SRT_ColumnDef<Person>[]>(() => {
		return columns.map((col) => ({
			...col,
		}))
	}, [])

	const table = useShadcnReactTable({
		columns: tableCols,
		data,
		enableKeyboardShortcuts: false,
		enableColumnActions: false,
		enableColumnFilters: false,
		enablePagination: false,
		enableSorting: false,
		renderCaption: ({ table }) =>
			`Here is a table rendered with the lighter weight SRT_Table sub-component, rendering ${table.getRowModel().rows.length} rows.`,
	})

	//using SRT_Table instead of ShadcnReactTable if we do not need any of the toolbar components or features

	return <SRT_Table table={table} />
}
