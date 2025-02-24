import type { HTMLAttributes } from 'react'
import { SRT_FilterTextField } from './SRT_FilterTextField'
import type { SRT_Header, SRT_RowData, SRT_TableInstance } from '@/types-SRT'
import { parseFromValuesOrFunc } from '@/utils/utils'
import { cn } from '@/lib/utils'

export interface SRT_FilterRangeFieldsProps<TData extends SRT_RowData> extends HTMLAttributes<HTMLDivElement> {
	header: SRT_Header<TData>
	table: SRT_TableInstance<TData>
	className?: string
}

export const SRT_FilterRangeFields = <TData extends SRT_RowData>({
	header,
	table,
	className,
	...rest
}: SRT_FilterRangeFieldsProps<TData>) => {
	return (
		<div
			{...rest}
			className={cn('grid gap-1rem grid-cols-2', className)}
			style={{
				...(parseFromValuesOrFunc(rest?.style, {}) as any),
			}}
		>
			{[0, 1].map((rangeFilterIndex) => (
				<SRT_FilterTextField
					header={header}
					key={rangeFilterIndex}
					rangeFilterIndex={rangeFilterIndex}
					table={table}
				/>
			))}
		</div>
	)
}
