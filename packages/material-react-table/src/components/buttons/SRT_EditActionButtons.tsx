import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { SRT_Row, SRT_RowData, SRT_TableInstance } from '@/types-SRT'
import { parseFromValuesOrFunc } from '@/utils/utils'

export interface SRT_EditActionButtonsProps<TData extends SRT_RowData> {
	row: SRT_Row<TData>
	table: SRT_TableInstance<TData>
	variant?: 'icon' | 'text'
	className?: string
}

export const SRT_EditActionButtons = <TData extends SRT_RowData>({
	row,
	table,
	variant = 'icon',
	className,
}: SRT_EditActionButtonsProps<TData>) => {
	const {
		getState,
		options: {
			icons: { CancelIcon, SaveIcon },
			localization,
			onCreatingRowCancel,
			onCreatingRowSave,
			onEditingRowCancel,
			onEditingRowSave,
		},
		refs: { editInputRefs },
		setCreatingRow,
		setEditingRow,
	} = table
	const { creatingRow, editingRow, isSaving } = getState()

	const isCreating = creatingRow?.id === row.id
	const isEditing = editingRow?.id === row.id

	const handleCancel = () => {
		if (isCreating) {
			onCreatingRowCancel?.({ row, table })
			setCreatingRow(null)
		} else if (isEditing) {
			onEditingRowCancel?.({ row, table })
			setEditingRow(null)
		}
		row._valuesCache = {} as any // reset values cache
	}

	const handleSubmitRow = () => {
		for (const inputRef of Object.values(editInputRefs.current ?? {})) {
			if (row.id === inputRef?.name?.split('_')?.[0]) {
				if (inputRef.value !== undefined && Object.hasOwn(row?._valuesCache as object, inputRef.name)) {
					// @ts-expect-error
					row._valuesCache[inputRef.name] = inputRef.value
				}
			}
		}
		if (isCreating)
			onCreatingRowSave?.({
				exitCreatingMode: () => setCreatingRow(null),
				row,
				table,
				values: row._valuesCache,
			})
		else if (isEditing) {
			onEditingRowSave?.({
				exitEditingMode: () => setEditingRow(null),
				row,
				table,
				values: row?._valuesCache,
			})
		}
	}

	return (
		<div
			onClick={(e) => e.stopPropagation()}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.stopPropagation()
				}
			}}
			className={`flex gap-3 ${className ?? ''}`}
		>
			{variant === 'icon' ? (
				<>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="ghost" size="icon" aria-label={localization.cancel} onClick={handleCancel}>
								<CancelIcon className="h-4 w-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>{localization.cancel}</TooltipContent>
					</Tooltip>
					{((isCreating && onCreatingRowSave) || (isEditing && onEditingRowSave)) && (
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									aria-label={localization.save}
									disabled={isSaving}
									onClick={handleSubmitRow}
									className="text-blue-600"
								>
									{isSaving ? <Progress className="h-4 w-4" /> : <SaveIcon className="h-4 w-4" />}
								</Button>
							</TooltipTrigger>
							<TooltipContent>{localization.save}</TooltipContent>
						</Tooltip>
					)}
				</>
			) : (
				<>
					<Button variant="outline" onClick={handleCancel} className="min-w-[100px]">
						{localization.cancel}
					</Button>
					<Button disabled={isSaving} onClick={handleSubmitRow} className="min-w-[100px]">
						{isSaving && <Progress className="h-4 w-4 mr-2" />}
						{localization.save}
					</Button>
				</>
			)}
		</div>
	)
}
