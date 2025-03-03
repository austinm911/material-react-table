import { ShadcnReactTable } from '@/components/ShadcnReactTable'
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

const data = [...Array(50)].map(() => ({
	address: faker.location.streetAddress(),
	city: faker.location.city(),
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	state: faker.location.state(),
}))

export function BasicExample() {
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

const meta: Meta = {
	title: 'Shadcn/Basic Example',
	component: BasicExample,
}

export default meta

type Story = StoryObj<typeof BasicExample>

export const Default: Story = {
	args: {},
}
