import type { ReactNode, RefObject } from "react";
import Box from "@mui/material/Box";
import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from "../../types";
import highlightWords from "highlight-words";

const allowedTypes = ["string", "number"];

export interface SRT_TableBodyCellValueProps<TData extends MRT_RowData> {
	cell: MRT_Cell<TData>;
	rowRef?: RefObject<HTMLTableRowElement | null>;
	staticColumnIndex?: number;
	staticRowIndex?: number;
	table: MRT_TableInstance<TData>;
}

export const SRT_TableBodyCellValue = <TData extends MRT_RowData>({
	cell,
	rowRef,
	staticColumnIndex,
	staticRowIndex,
	table,
}: SRT_TableBodyCellValueProps<TData>) => {
	const {
		getState,
		options: {
			enableFilterMatchHighlighting,
			mrtTheme: { matchHighlightColor },
		},
	} = table;
	const { column, row } = cell;
	const { columnDef } = column;
	const { globalFilter, globalFilterFn } = getState();
	const filterValue = column.getFilterValue();

	let renderedCellValue =
		cell.getIsAggregated() && columnDef.AggregatedCell
			? columnDef.AggregatedCell({
					cell,
					column,
					row,
					table,
					staticColumnIndex,
					staticRowIndex,
				})
			: row.getIsGrouped() && !cell.getIsGrouped()
				? null
				: cell.getIsGrouped() && columnDef.GroupedCell
					? columnDef.GroupedCell({
							cell,
							column,
							row,
							table,
							staticColumnIndex,
							staticRowIndex,
						})
					: undefined;

	const isGroupedValue = renderedCellValue !== undefined;

	if (!isGroupedValue) {
		renderedCellValue = cell.renderValue() as ReactNode | number | string;
	}

	if (
		enableFilterMatchHighlighting &&
		columnDef.enableFilterMatchHighlighting !== false &&
		String(renderedCellValue) &&
		allowedTypes.includes(typeof renderedCellValue) &&
		((filterValue &&
			allowedTypes.includes(typeof filterValue) &&
			["autocomplete", "text"].includes(columnDef.filterVariant!)) ||
			(globalFilter &&
				allowedTypes.includes(typeof globalFilter) &&
				column.getCanGlobalFilter()))
	) {
		const chunks = highlightWords?.({
			matchExactly:
				(filterValue ? columnDef._filterFn : globalFilterFn) !== "fuzzy",
			query: (filterValue ?? globalFilter ?? "").toString(),
			text: renderedCellValue?.toString() as string,
		});
		if (chunks?.length > 1 || chunks?.[0]?.match) {
			renderedCellValue = (
				<span aria-label={renderedCellValue as string} role="note">
					{chunks?.map(({ key, match, text }) => (
						<Box
							aria-hidden="true"
							component="span"
							key={key}
							sx={
								match
									? {
											backgroundColor: matchHighlightColor,
											borderRadius: "2px",
											color: (theme) =>
												theme.palette.mode === "dark"
													? theme.palette.common.white
													: theme.palette.common.black,
											padding: "2px 1px",
										}
									: undefined
							}
						>
							{text}
						</Box>
					)) ?? renderedCellValue}
				</span>
			);
		}
	}

	if (columnDef.Cell && !isGroupedValue) {
		renderedCellValue = columnDef.Cell({
			cell,
			column,
			renderedCellValue,
			row,
			rowRef,
			staticColumnIndex,
			staticRowIndex,
			table,
		});
	}

	return renderedCellValue;
};
