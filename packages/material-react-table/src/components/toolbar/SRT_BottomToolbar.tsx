import { SRT_LinearProgressBar } from './SRT_LinearProgressBar'
import { SRT_TablePagination } from './SRT_TablePagination'
import { SRT_ToolbarAlertBanner } from './SRT_ToolbarAlertBanner'
import { SRT_ToolbarDropZone } from './SRT_ToolbarDropZone'
import type { SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { getCommonToolbarStyles } from '../../utils/style.utils.shadcn'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { cn } from '@/lib/utils'

import { useMediaQuery } from '@/hooks/use-media-query'
export interface SRT_BottomToolbarProps<TData extends SRT_RowData> {
	table: SRT_TableInstance<TData>
	SRTBottomToolbarProps?:
		| ((props: {
				table: SRT_TableInstance<TData>
		  }) => React.ComponentProps<'div'>)
		| React.ComponentProps<'div'>
	renderBottomToolbarCustom?: (props: {
		table: SRT_TableInstance<TData>
		defaultToolbar: React.ReactNode
	}) => React.ReactNode
}

export const SRT_BottomToolbar = <TData extends SRT_RowData>({ table, ...rest }: SRT_BottomToolbarProps<TData>) => {
	const {
		getState,
		options: {
			enablePagination,
			shadcnBottomToolbarProps,
			positionPagination,
			positionToolbarAlertBanner,
			positionToolbarDropZone,
			renderBottomToolbarCustomActions,
		},
		refs: { bottomToolbarRef },
	} = table
	const { SRTBottomToolbarProps, renderBottomToolbarCustom } = rest
	const { isFullScreen } = getState()

	const isMobile = useMediaQuery('(max-width:720px)')

	// Default Tailwind container styles
	const defaultContainerProps: React.ComponentPropsWithoutRef<'div'> = {
		className: cn('bg-background p-2 shadow', isFullScreen ? 'fixed bottom-0 left-0 right-0' : 'relative'),
	}

	// Evaluate user provided container props (if function, call it)
	const userContainerProps =
		typeof SRTBottomToolbarProps === 'function' ? SRTBottomToolbarProps({ table }) : (SRTBottomToolbarProps ?? {})

	// Merge default props with user overrides
	const containerProps: React.ComponentPropsWithoutRef<'div'> = {
		...defaultContainerProps,
		...userContainerProps,
		className: cn(defaultContainerProps.className, userContainerProps.className),
	}

	const toolbarProps = {
		...parseFromValuesOrFunc(shadcnBottomToolbarProps, { table }),
		...rest,
	}

	const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions

	// Default toolbar content constructed using current table state
	const defaultToolbar = (
		<>
			<SRT_LinearProgressBar isTopToolbar={false} table={table} />
			{positionToolbarAlertBanner === 'bottom' && <SRT_ToolbarAlertBanner table={table} />}
			{['both', 'bottom'].includes(positionToolbarDropZone ?? '') && <SRT_ToolbarDropZone table={table} />}
			<div className="flex items-center justify-end">
				{renderBottomToolbarCustomActions ? renderBottomToolbarCustomActions({ table }) : <span />}
				{enablePagination && ['both', 'bottom'].includes(positionPagination ?? '') && (
					<SRT_TablePagination position="bottom" table={table} />
				)}
			</div>
		</>
	)

	// Render custom toolbar if provided; otherwise, render default content
	return (
		<div
			{...containerProps}
			ref={(node: HTMLDivElement | null) => {
				if (node) {
					bottomToolbarRef.current = node
					// Note: avoid assigning to user provided ref if using new patterns.
				}
			}}
		>
			{renderBottomToolbarCustom ? renderBottomToolbarCustom({ table, defaultToolbar }) : defaultToolbar}
		</div>
	)
}
