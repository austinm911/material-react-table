import type { CircularProgressProps, SRT_RowData, SRT_TableInstance } from '@/types-SRT'
import { parseFromValuesOrFunc } from '@/utils/utils'
import { CircularProgress } from '@/components/ui/circular-progress'
import { cn } from '@/lib/utils'

export interface SRT_TableLoadingOverlayProps<TData extends SRT_RowData> extends CircularProgressProps {
	table: SRT_TableInstance<TData>
}

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
			<CircularProgress aria-label={localization.noRecordsToDisplay} {...circularProgressProps} />
		</div>
	)
}
