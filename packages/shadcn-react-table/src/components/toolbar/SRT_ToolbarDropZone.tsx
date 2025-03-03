import { type DragEvent, useEffect } from 'react'
import type { SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { cn } from '@/lib/utils'

export interface SRT_ToolbarDropZoneProps<TData extends SRT_RowData> extends React.ComponentProps<'div'> {
	table: SRT_TableInstance<TData>
}

export const SRT_ToolbarDropZone = <TData extends SRT_RowData>({
	table,
	className,
	...rest
}: SRT_ToolbarDropZoneProps<TData>) => {
	const {
		getState,
		options: { enableGrouping, localization },
		setHoveredColumn,
		setShowToolbarDropZone,
	} = table

	const { draggingColumn, grouping, hoveredColumn, showToolbarDropZone } = getState()

	const handleDragEnter = (_event: DragEvent<HTMLDivElement>) => {
		setHoveredColumn({ id: 'drop-zone' })
	}

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault()
	}

	useEffect(() => {
		if (table.options.state?.showToolbarDropZone !== undefined) {
			setShowToolbarDropZone(
				!!enableGrouping &&
					!!draggingColumn &&
					draggingColumn.columnDef.enableGrouping !== false &&
					!grouping.includes(draggingColumn.id),
			)
		}
	}, [enableGrouping, draggingColumn, grouping])

	if (!showToolbarDropZone) return null

	return (
		<div
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			className={cn(
				'absolute w-full h-full z-10',
				'flex items-center justify-center',
				'border-2 border-dashed border-info-500',
				'backdrop-blur-sm',
				'transition-all duration-300 ease-in-out',
				hoveredColumn?.id === 'drop-zone' ? 'bg-info-500/20 opacity-100' : 'bg-info-500/10 opacity-90',
				className,
			)}
			{...rest}
		>
			<p className="italic text-muted-foreground">
				{localization.dropToGroupBy.replace('{column}', draggingColumn?.columnDef?.header ?? '')}
			</p>
		</div>
	)
}
