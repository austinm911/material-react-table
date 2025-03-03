import type { Meta } from '@storybook/react'
import { SRT_CopyButton } from '@/components/buttons/SRT_CopyButton'
import { useShadcnReactTable } from '@/hooks/useShadcnReactTable'
import { columns, createPersonData, type Person } from '../../mock'

const meta: Meta = {
	title: 'Primatives/Buttons/Copy Button',
}

export default meta

const data = createPersonData(10)

export const Primative = () => {
	const table = useShadcnReactTable<Person>({
		columns,
		data,
		enableClickToCopy: true,
	})

	const row = table.getRowModel().rows[0]
	const cell = row.getVisibleCells()[0]

	if (!cell) {
		return <div>Cell not found</div>
	}

	return (
		<SRT_CopyButton cell={cell} table={table}>
			<span>{cell.getValue() as string}</span>
		</SRT_CopyButton>
	)
}
