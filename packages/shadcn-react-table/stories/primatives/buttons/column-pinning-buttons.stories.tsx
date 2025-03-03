import type { Meta } from '@storybook/react'
import { SRT_ColumnPinningButtons } from '@/components/buttons/SRT_ColumnPinningButtons'
import { useShadcnReactTable } from '@/hooks/useShadcnReactTable'
import { columns, createPersonData } from '../../mock'

const meta: Meta = {
	title: 'Primatives/Buttons/Column Pinning Button',
}

export default meta

const data = createPersonData(10)

export const Primative = () => {
	const table = useShadcnReactTable({
		columns,
		data,
		enableColumnPinning: true,
	})

	const column = table.getColumn('firstName')

	if (!column) return <div>Column not found</div>

	return <SRT_ColumnPinningButtons column={column} table={table} />
}

// TODO: create a dropdown menu to show all columns
export const AllColumns = () => {
	const table = useShadcnReactTable({
		columns,
		data,
		enableColumnPinning: true,
	})

	const allColumns = table.getAllColumns()

	return (
		<div className="flex flex-col gap-2">
			{allColumns.map((column) => (
				<SRT_ColumnPinningButtons key={column.id} column={column} table={table} />
			))}
		</div>
	)
}
