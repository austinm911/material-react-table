import { ShadcnReactTable } from '@/components/ShadcnReactTable'
import { useShadcnReactTable } from '@/hooks/useShadcnReactTable'
import type { SRT_ColumnDef } from '@/types-SRT'
import { useMemo } from 'react'
import { columns, createPersonData, type Person } from '../mock'
import type { Meta } from '@storybook/react'

const meta: Meta = {
	title: 'Examples/Basic Example',
}

export default meta

const data = createPersonData(50)

export const Example = () => {
	const tableCols = useMemo<SRT_ColumnDef<Person>[]>(() => {
		return columns.map((col) => ({
			...col,
		}))
	}, [])

	const table = useShadcnReactTable({
		columns: tableCols,
		data,
	})

	return <ShadcnReactTable table={table} />
}
