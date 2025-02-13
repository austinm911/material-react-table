import Box from "@mui/material/Box";
import CircularProgress, {
	type CircularProgressProps,
} from "@mui/material/CircularProgress";
import { alpha } from "@mui/material/styles";
import type { MRT_RowData, MRT_TableInstance } from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";

// Renamed interface to SRT_TableLoadingOverlayProps
export interface SRT_TableLoadingOverlayProps<TData extends MRT_RowData>
	extends CircularProgressProps {
	table: MRT_TableInstance<TData>;
}

// Renamed export to SRT_TableLoadingOverlay
export const SRT_TableLoadingOverlay = <TData extends MRT_RowData>({
	table,
	...rest
}: SRT_TableLoadingOverlayProps<TData>) => {
	const {
		options: {
			id,
			localization,
			mrtTheme: { baseBackgroundColor },
			muiCircularProgressProps,
		},
	} = table;

	const circularProgressProps = {
		...parseFromValuesOrFunc(muiCircularProgressProps, { table }),
		...rest,
	};

	return (
		<Box
			sx={{
				alignItems: "center",
				backgroundColor: alpha(baseBackgroundColor, 0.5),
				bottom: 0,
				display: "flex",
				justifyContent: "center",
				left: 0,
				maxHeight: "100vh",
				position: "absolute",
				right: 0,
				top: 0,
				width: "100%",
				zIndex: 3,
			}}
		>
			{circularProgressProps?.Component ?? (
				<CircularProgress
					aria-label={localization.noRecordsToDisplay}
					id={`mrt-progress-${id}`}
					{...circularProgressProps}
				/>
			)}
		</Box>
	);
};
