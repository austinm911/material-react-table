import { useMemo } from 'react'
import { ShadcnReactTable, type SRT_ColumnDef, useShadcnReactTable } from 'shadcn-react-table'

import { createPersonData, type Person, columns } from '../../../../lib/mock'

const data = createPersonData(10)

const Example = () => {
	//should be memoized or stable
	const tableCols = useMemo<SRT_ColumnDef<Person>[]>(() => columns, [])

	const table = useShadcnReactTable({
		columns: tableCols,
		data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
	})

	return <ShadcnReactTable table={table} />
}

export default Example
