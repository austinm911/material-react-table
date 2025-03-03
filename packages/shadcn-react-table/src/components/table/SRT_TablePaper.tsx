import { Card } from '../ui/card'
import type { SRT_RowData, SRT_TableInstance, CardProps } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_TableContainer } from './SRT_TableContainer'
import { SRT_BottomToolbar } from '../toolbar/SRT_BottomToolbar'
import { SRT_TopToolbar } from '../toolbar/SRT_TopToolbar'
import { cn } from '@/lib/utils'

export interface SRT_TablePaperProps<TData extends SRT_RowData> extends CardProps {
	table: SRT_TableInstance<TData>
}

export function SRT_TablePaper<TData extends SRT_RowData>({ table, className, ...rest }: SRT_TablePaperProps<TData>) {
	const {
		getState,
		options: {
			enableBottomToolbar,
			enableTopToolbar,
			shadcnTablePaperProps: muiTablePaperProps,
			renderBottomToolbar,
			renderTopToolbar,
		},
		refs: { tablePaperRef },
	} = table
	const { isFullScreen } = getState()

	const cardProps = {
		...parseFromValuesOrFunc(muiTablePaperProps, { table }),
		...rest,
	}

	return (
		<Card
			ref={(ref: HTMLDivElement) => {
				tablePaperRef.current = ref
				if (cardProps?.ref) {
					// @ts-expect-error
					cardProps.ref.current = ref
				}
			}}
			onKeyDown={(e) => e.key === 'Escape' && table.setIsFullScreen(false)}
			className={cn(
				className,
				isFullScreen && 'fixed inset-0 z-50 w-screen h-screen m-0 p-0',
				'overflow-hidden transition-all duration-100 ease-in-out',
			)}
			style={{
				...cardProps?.style,
			}}
			{...cardProps}
		>
			{enableTopToolbar &&
				(parseFromValuesOrFunc(renderTopToolbar, { table }) ?? <SRT_TopToolbar table={table} />)}
			<SRT_TableContainer table={table} />
			{enableBottomToolbar &&
				(parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? <SRT_BottomToolbar table={table} />)}
		</Card>
	)
}
