import { useShadcnReactTable } from '@/hooks/useShadcnReactTable'
import type { Meta } from '@storybook/react'
import { columns, createPersonData } from '../../mock'
import { SRT_TableBodyCell } from '@/components/body/SRT_TableBodyCell'
import { useRef } from 'react'
import { Table, TableBody, TableRow } from '@/components/ui/table'

const meta: Meta = {
	title: 'Primatives/Body/Table Body Cell',
}

export default meta

const data = createPersonData(10)

export const Primative = () => {
	const table = useShadcnReactTable({
		columns,
		data,
		enableClickToCopy: true,
	})

	const row = table.getRowModel().rows[0]
	const cell = row.getVisibleCells()[0]

	if (!cell) {
		return <div>Cell not found</div>
	}

	const rowRef = useRef<HTMLTableRowElement>(null)

	return (
		<Table>
			<TableBody>
				<TableRow ref={rowRef}>
					{/* Render the SRT_TableBodyCell component. */}
					<SRT_TableBodyCell cell={cell} rowRef={rowRef} staticRowIndex={0} table={table} />
				</TableRow>
			</TableBody>
		</Table>
	)
}
