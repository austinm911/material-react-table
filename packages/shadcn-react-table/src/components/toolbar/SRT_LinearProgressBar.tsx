import type { SRT_RowData, SRT_TableInstance, ProgressProps } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { Progress } from '../ui/progress'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'

export interface SRT_LinearProgressBarProps<TData extends SRT_RowData> extends ProgressProps {
	isTopToolbar: boolean
	table: SRT_TableInstance<TData>
}

export const SRT_LinearProgressBar = <TData extends SRT_RowData>({
	isTopToolbar,
	table,
	...rest
}: SRT_LinearProgressBarProps<TData>) => {
	const {
		getState,
		options: { shadcnLinearProgressProps },
	} = table
	const { isSaving, showProgressBars } = getState()

	const linearProgressProps = {
		...parseFromValuesOrFunc(shadcnLinearProgressProps, { isTopToolbar, table }),
		...rest,
	}

	if (showProgressBars === false || (!showProgressBars && !isSaving)) {
		return null
	}

	return (
		<Collapsible open>
			<CollapsibleContent
				style={{
					bottom: isTopToolbar ? 0 : undefined,
					position: 'absolute',
					top: !isTopToolbar ? 0 : undefined,
					width: '100%',
				}}
			>
				<Progress
					aria-busy="true"
					aria-label="Loading"
					style={{ position: 'relative' }}
					{...linearProgressProps}
				/>
			</CollapsibleContent>
		</Collapsible>
	)
}
