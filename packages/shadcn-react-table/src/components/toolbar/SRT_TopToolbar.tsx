import { SRT_LinearProgressBar } from './SRT_LinearProgressBar'
import { SRT_TablePagination } from './SRT_TablePagination'
import { SRT_ToolbarAlertBanner } from './SRT_ToolbarAlertBanner'
import { SRT_ToolbarDropZone } from './SRT_ToolbarDropZone'
import { SRT_ToolbarInternalButtons } from './SRT_ToolbarInternalButtons'
import type { SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_GlobalFilterTextField } from '../inputs/SRT_GlobalFilterTextField'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { getCommonToolbarStyles } from '@/utils/style.utils'

export interface SRT_TopToolbarProps<TData extends SRT_RowData> {
	table: SRT_TableInstance<TData>
}

export const SRT_TopToolbar = <TData extends SRT_RowData>({ table }: SRT_TopToolbarProps<TData>) => {
	const {
		getState,
		options: {
			enableGlobalFilter,
			enablePagination,
			enableToolbarInternalActions,
			positionGlobalFilter,
			positionPagination,
			positionToolbarAlertBanner,
			positionToolbarDropZone,
			renderTopToolbarCustomActions,
			shadcnTopToolbarProps,
		},
		refs: { topToolbarRef },
	} = table
	const { showColumnFilters } = getState()

	const toolbarProps = {
		...parseFromValuesOrFunc(shadcnTopToolbarProps, { table }),
	}

	const stackAlertBanner = positionToolbarAlertBanner === 'top'
	const stackDropZone = ['both', 'top'].includes(positionToolbarDropZone ?? '')

	return (
		<div
			ref={(node) => {
				if (node) {
					topToolbarRef.current = node
					if (toolbarProps?.ref) {
						// @ts-expect-error
						toolbarProps.ref.current = node
					}
				}
			}}
			className={cn(
				// Remove flex-wrap-reverse and add flex-col to ensure vertical stacking
				'flex flex-col gap-2 w-full p-2',
				toolbarProps?.className,
			)}
			{...toolbarProps}
		>
			{/* Alert Banner */}
			{stackAlertBanner && <SRT_ToolbarAlertBanner table={table} />}

			{/* Drop Zone */}
			{stackDropZone && <SRT_ToolbarDropZone table={table} />}

			{/* Main Toolbar Content */}
			<div className="flex items-center justify-between w-full gap-2">
				{/* Left Side: Custom Actions */}
				<div className="flex items-center gap-2">{renderTopToolbarCustomActions?.({ table })}</div>

				{/* Right Side: Internal Actions */}
				<div className="flex items-center gap-2 ml-auto">
					{enableGlobalFilter && positionGlobalFilter === 'left' && (
						<SRT_GlobalFilterTextField table={table} />
					)}
					{enableToolbarInternalActions && <SRT_ToolbarInternalButtons table={table} />}
					{enableGlobalFilter && positionGlobalFilter === 'right' && (
						<SRT_GlobalFilterTextField table={table} />
					)}
				</div>
			</div>

			{/* Column Filters */}
			{/* {showColumnFilters && <SRT_ColumnFilters table={table} />} */}

			{/* Pagination */}
			{enablePagination && ['top', 'both'].includes(positionPagination ?? '') && (
				<div className="flex justify-center w-full">
					<SRT_TablePagination position="top" table={table} />
				</div>
			)}
			<SRT_LinearProgressBar isTopToolbar table={table} />
		</div>
	)
}
