import { ShadcnReactTable } from '@/components/ShadcnReactTable'
import type { SRT_ColumnDef } from '@/types-SRT'
import { faker } from '@faker-js/faker'
import type { Meta } from '@storybook/react'

const meta: Meta = {
	title: 'Shadcn/Grid Layout',
}

export default meta

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

const data = [...Array(6)].map(() => ({
	address: faker.location.streetAddress(),
	city: faker.location.city(),
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	state: faker.location.state(),
}))

export const ShadcnCenterAlignInGridLayoutMode = () => {
	return (
		<ShadcnReactTable
			columns={columns}
			data={data}
			layoutMode="grid"
			shadcnTableBodyCellProps={{
				align: 'center',
			}}
			shadcnTableHeadCellProps={{
				align: 'center',
			}}
		/>
	)
}

export const ShadcnRightAlignInGridLayoutMode = () => {
	return (
		<ShadcnReactTable
			columns={columns}
			data={data}
			layoutMode="grid"
			shadcnTableBodyCellProps={{
				align: 'right',
			}}
			shadcnTableHeadCellProps={{
				align: 'right',
			}}
		/>
	)
}
