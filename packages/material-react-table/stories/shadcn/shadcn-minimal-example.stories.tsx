import { SRT_Table } from '@/components/table/SRT_Table'
import { useShadcnReactTable } from '@/hooks/useShadcnReactTable'
import type { SRT_ColumnDef } from '@/types-SRT'
import { faker } from '@faker-js/faker'
import type { Meta, StoryObj } from '@storybook/react'
import { useMemo } from 'react'

type Person = {
	address: string
	city: string
	firstName: string
	lastName: string
	state: string
}

const columns: SRT_ColumnDef<Person>[] = [
	{
		accessorKey: 'firstName',
		header: 'First Name',
	},
	{
		accessorKey: 'lastName',
		header: 'Last Name',
	},
	{
		accessorKey: 'address',
		header: 'Address',
	},
	{
		accessorKey: 'city',
		header: 'City',
	},
	{
		accessorKey: 'state',
		header: 'State',
	},
]

const data = [...Array(7)].map(() => ({
	address: faker.location.streetAddress(),
	city: faker.location.city(),
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	state: faker.location.state(),
}))

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

const meta: Meta = {
	title: 'Shadcn/Minimal Example',
	component: Example,
}

export default meta

type Story = StoryObj<typeof Example>

export const Default: Story = {
	args: {},
}
