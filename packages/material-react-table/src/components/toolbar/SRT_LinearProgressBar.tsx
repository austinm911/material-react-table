import Collapse from "@mui/material/Collapse";
import LinearProgress, {
	type LinearProgressProps,
} from "@mui/material/LinearProgress";
import type { MRT_RowData, MRT_TableInstance } from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";

// Changed interface name to SRT_LinearProgressBarProps
export interface SRT_LinearProgressBarProps<TData extends MRT_RowData>
	extends LinearProgressProps {
	isTopToolbar: boolean;
	table: MRT_TableInstance<TData>;
}

// Changed export name to SRT_LinearProgressBar
export const SRT_LinearProgressBar = <TData extends MRT_RowData>({
	isTopToolbar,
	table,
	...rest
}: SRT_LinearProgressBarProps<TData>) => {
	const {
		getState,
		options: { muiLinearProgressProps },
	} = table;
	const { isSaving, showProgressBars } = getState();

	const linearProgressProps = {
		...parseFromValuesOrFunc(muiLinearProgressProps, {
			isTopToolbar,
			table,
		}),
		...rest,
	};

	return (
		<Collapse
			in={showProgressBars !== false && (showProgressBars || isSaving)}
			mountOnEnter
			sx={{
				bottom: isTopToolbar ? 0 : undefined,
				position: "absolute",
				top: !isTopToolbar ? 0 : undefined,
				width: "100%",
			}}
			unmountOnExit
		>
			<LinearProgress
				aria-busy="true"
				aria-label="Loading"
				sx={{ position: "relative" }}
				{...linearProgressProps}
			/>
		</Collapse>
	);
};
