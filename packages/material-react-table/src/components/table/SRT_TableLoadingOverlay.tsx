import type { SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { CircularProgress } from '../ui/circular-progress'
import { cn } from '@/lib/utils'

// Renamed interface to SRT_TableLoadingOverlayProps
export interface SRT_TableLoadingOverlayProps<TData extends SRT_RowData> {
	table: SRT_TableInstance<TData>
}

// Renamed export to SRT_TableLoadingOverlay
export const SRT_TableLoadingOverlay = <TData extends SRT_RowData>({
	table,
	...rest
}: SRT_TableLoadingOverlayProps<TData>) => {
	const {
		options: {
			id,
			localization,
			shadcnTheme: { baseBackgroundColor },
			shadcnCircularProgressProps,
		},
	} = table

	const circularProgressProps = {
		...parseFromValuesOrFunc(shadcnCircularProgressProps, { table }),
		...rest,
	}

	return (
		<div
			className={cn(
				'absolute bottom-0 left-0 z-3 flex h-full w-full items-center justify-center bg-background/50',
			)}
			id={`srt-progress-${id}`}
		>
			{/* TODO: Add props */}
			<CircularProgress {...circularProgressProps} />
		</div>
	)
}
