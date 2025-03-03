import { SRT_LinearProgressBar } from './SRT_LinearProgressBar'
import { SRT_TablePagination } from './SRT_TablePagination'
import { SRT_ToolbarAlertBanner } from './SRT_ToolbarAlertBanner'
import { SRT_ToolbarDropZone } from './SRT_ToolbarDropZone'
import { SRT_ToolbarInternalButtons } from './SRT_ToolbarInternalButtons'
import type { SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { getCommonToolbarStyles } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_GlobalFilterTextField } from '../inputs/SRT_GlobalFilterTextField'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'

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
			shadcnTopToolbarProps,
			positionGlobalFilter,
			positionPagination,
			positionToolbarAlertBanner,
			positionToolbarDropZone,
			renderTopToolbarCustomActions,
		},
		refs: { topToolbarRef },
	} = table

	const { isFullScreen, showGlobalFilter } = getState()

	const isMobile = useMediaQuery('(max-width:720px)')
	const isTablet = useMediaQuery('(max-width:1024px)')

	const toolbarProps = parseFromValuesOrFunc(shadcnTopToolbarProps, { table })

	const stackAlertBanner = isMobile || !!renderTopToolbarCustomActions || (showGlobalFilter && isTablet)

	const globalFilterProps = {
		sx: !isTablet
			? {
					zIndex: 2,
				}
			: undefined,
		table,
	}

	return (
		<div
			{...toolbarProps}
			ref={(ref: HTMLDivElement) => {
				topToolbarRef.current = ref
				if (toolbarProps?.ref) {
					// @ts-expect-error
					toolbarProps.ref.current = ref
				}
			}}
			className={cn(
				isFullScreen ? 'sticky top-0' : 'relative',
				'w-full',
				parseFromValuesOrFunc(toolbarProps?.className, { theme: {} }) as string,
			)}
		>
			{positionToolbarAlertBanner === 'top' && (
				<SRT_ToolbarAlertBanner stackAlertBanner={stackAlertBanner} table={table} />
			)}
			{['both', 'top'].includes(positionToolbarDropZone ?? '') && <SRT_ToolbarDropZone table={table} />}
			<div
				className={cn(
					'flex',
					'items-start',
					'box-border',
					'gap-2',
					'justify-between',
					'p-2',
					stackAlertBanner ? 'relative' : 'absolute',
					'right-0',
					'top-0',
					'w-full',
				)}
			>
				{enableGlobalFilter && positionGlobalFilter === 'left' && (
					<SRT_GlobalFilterTextField {...globalFilterProps} />
				)}
				{renderTopToolbarCustomActions?.({ table }) ?? <span />}
				{enableToolbarInternalActions ? (
					<div className={cn('flex', 'items-center', 'flex-wrap-reverse', 'gap-2', 'justify-end')}>
						{enableGlobalFilter && positionGlobalFilter === 'right' && (
							<SRT_GlobalFilterTextField {...globalFilterProps} />
						)}
						<SRT_ToolbarInternalButtons table={table} />
					</div>
				) : (
					enableGlobalFilter &&
					positionGlobalFilter === 'right' && <SRT_GlobalFilterTextField {...globalFilterProps} />
				)}
			</div>
			{enablePagination && ['both', 'top'].includes(positionPagination ?? '') && (
				<SRT_TablePagination position="top" table={table} />
			)}
			<SRT_LinearProgressBar isTopToolbar table={table} />
		</div>
	)
}
