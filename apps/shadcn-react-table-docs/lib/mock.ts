import type { SRT_ColumnDef } from 'shadcn-react-table'
import { faker } from '@faker-js/faker'

export type Person = {
	address: string
	city: string
	firstName: string
	lastName: string
	state: string
}

export const columns: SRT_ColumnDef<Person>[] = [
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

export function createPersonData(count: number): Person[] {
	return Array.from({ length: count }, () => ({
		address: faker.location.streetAddress(),
		city: faker.location.city(),
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		state: faker.location.state(),
	}))
}
