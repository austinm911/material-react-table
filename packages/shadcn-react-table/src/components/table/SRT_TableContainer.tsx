import { useEffect, useLayoutEffect, useState } from 'react'
import { Table } from '@/components/ui/table'
import { SRT_Table } from '@/components/table/SRT_Table'
import { SRT_TableLoadingOverlay } from '@/components/table/SRT_TableLoadingOverlay'
import type { SRT_RowData, SRT_TableInstance, TableProps } from '@/types-SRT'
import { parseFromValuesOrFunc } from '@/utils/utils'
import { SRT_CellActionMenu } from '@/components/menus/SRT_CellActionMenu'
import { SRT_EditRowModal } from '@/components/modals/SRT_EditRowModal'
import { cn } from '@/lib/utils'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface SRT_TableContainerProps<TData extends SRT_RowData> extends TableProps {
	table: SRT_TableInstance<TData>
}

// Renamed export to SRT_TableContainer
export const SRT_TableContainer = <TData extends SRT_RowData>({
	table,
	className,
	...rest
}: SRT_TableContainerProps<TData>) => {
	const {
		getState,
		options: {
			createDisplayMode,
			editDisplayMode,
			enableCellActions,
			enableStickyHeader,
			shadcnTableContainerProps,
		},
		refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
	} = table
	const { actionCell, creatingRow, editingRow, isFullScreen, isLoading, showLoadingOverlay } = getState()

	const loading = showLoadingOverlay !== false && (isLoading || showLoadingOverlay)

	const [totalToolbarHeight, setTotalToolbarHeight] = useState(0)

	const tableContainerProps = {
		...parseFromValuesOrFunc(shadcnTableContainerProps, {
			table,
		}),
		...rest,
	}

	useIsomorphicLayoutEffect(() => {
		const topToolbarHeight = typeof document !== 'undefined' ? (topToolbarRef.current?.offsetHeight ?? 0) : 0

		const bottomToolbarHeight = typeof document !== 'undefined' ? (bottomToolbarRef?.current?.offsetHeight ?? 0) : 0

		setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight)
	})

	const createModalOpen = createDisplayMode === 'modal' && creatingRow
	const editModalOpen = editDisplayMode === 'modal' && editingRow

	return (
		<Table
			aria-busy={loading}
			aria-describedby={loading ? 'mrt-progress' : undefined}
			ref={(node: HTMLTableElement) => {
				if (node) {
					tableContainerRef.current = node
					if (tableContainerProps?.ref) {
						// @ts-expect-error
						tableContainerProps.ref.current = node
					}
				}
			}}
			className={cn('relative w-full overflow-auto', className)} // optional className
			style={{
				maxHeight: isFullScreen
					? `calc(100vh - ${totalToolbarHeight}px)`
					: enableStickyHeader
						? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
						: undefined,
				maxWidth: '100%',
				overflow: 'auto',
				position: 'relative',
				...tableContainerProps?.style,
			}}
		>
			{loading ? (
				<SRT_TableLoadingOverlay
					table={table}
					max={100}
					value={50}
					min={0}
					gaugePrimaryColor="red"
					gaugeSecondaryColor="blue"
				/>
			) : null}
			<SRT_Table table={table} />
			{(createModalOpen || editModalOpen) && <SRT_EditRowModal open table={table} />}
			{enableCellActions && actionCell && <SRT_CellActionMenu table={table} />}
		</Table>
	)
}
