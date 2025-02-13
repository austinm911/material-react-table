import Box from "@mui/material/Box";
import type { IconButtonProps } from "@mui/material/IconButton";
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { SRT_RowPinButton } from "../buttons/SRT_RowPinButton";

// Duplicate of MRT_TableBodyRowPinButton with SRT_ prefix
export interface SRT_TableBodyRowPinButtonProps<TData extends MRT_RowData>
	extends IconButtonProps {
	row: MRT_Row<TData>;
	table: MRT_TableInstance<TData>;
}

export const SRT_TableBodyRowPinButton = <TData extends MRT_RowData>({
	row,
	table,
	...rest
}: SRT_TableBodyRowPinButtonProps<TData>) => {
	const {
		options: { enableRowPinning, rowPinningDisplayMode },
	} = table;
	const canPin = parseFromValuesOrFunc(enableRowPinning, row);
	if (!canPin) return null;

	const rowPinButtonProps = { row, table, ...rest };

	if (rowPinningDisplayMode === "top-and-bottom" && !row.getIsPinned()) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection:
						table.getState().density === "compact" ? "row" : "column",
				}}
			>
				<SRT_RowPinButton pinningPosition="top" {...rowPinButtonProps} />
				<SRT_RowPinButton pinningPosition="bottom" {...rowPinButtonProps} />
			</Box>
		);
	}

	return (
		<SRT_RowPinButton
			pinningPosition={rowPinningDisplayMode === "bottom" ? "bottom" : "top"}
			{...rowPinButtonProps}
		/>
	);
};
