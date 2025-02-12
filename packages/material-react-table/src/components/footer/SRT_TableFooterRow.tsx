import TableRow, { type TableRowProps } from "@mui/material/TableRow";
import { SRT_TableFooterCell } from "./SRT_TableFooterCell";
import type {
	MRT_ColumnVirtualizer,
	MRT_Header,
	MRT_HeaderGroup,
	MRT_RowData,
	MRT_TableInstance,
	MRT_VirtualItem,
} from "../../types-SRT";
import { parseFromValuesOrFunc } from "../../utils/utils";

export interface SRT_TableFooterRowProps<TData extends MRT_RowData>
	extends TableRowProps {
	columnVirtualizer?: MRT_ColumnVirtualizer;
	footerGroup: MRT_HeaderGroup<TData>;
	table: MRT_TableInstance<TData>;
}

export const SRT_TableFooterRow = <TData extends MRT_RowData>({
	columnVirtualizer,
	footerGroup,
	table,
	...rest
}: SRT_TableFooterRowProps<TData>) => {
	const {
		options: {
			layoutMode,
			mrtTheme: { baseBackgroundColor },
			muiTableFooterRowProps,
		},
	} = table;

	const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
		columnVirtualizer ?? {};

	// if no content in row, skip row
	if (
		!footerGroup.headers?.some(
			(header) =>
				(typeof header.column.columnDef.footer === "string" &&
					!!header.column.columnDef.footer) ||
				header.column.columnDef.Footer,
		)
	) {
		return null;
	}

	const tableRowProps = {
		...parseFromValuesOrFunc(muiTableFooterRowProps, { footerGroup, table }),
		...rest,
	};

	return (
		<TableRow
			{...tableRowProps}
			sx={(theme) => ({
				backgroundColor: baseBackgroundColor,
				display: layoutMode?.startsWith("grid") ? "flex" : undefined,
				position: "relative",
				width: "100%",
				...(parseFromValuesOrFunc(tableRowProps?.sx, theme) as any),
			})}
		>
			{virtualPaddingLeft ? (
				<th style={{ display: "flex", width: virtualPaddingLeft }} />
			) : null}
			{(virtualColumns ?? footerGroup.headers).map(
				(footerOrVirtualFooter, staticColumnIndex) => {
					let footer = footerOrVirtualFooter as MRT_Header<TData>;
					if (columnVirtualizer) {
						staticColumnIndex = (footerOrVirtualFooter as MRT_VirtualItem)
							.index;
						footer = footerGroup.headers[staticColumnIndex];
					}

					return footer ? (
						<SRT_TableFooterCell
							footer={footer}
							key={footer.id}
							staticColumnIndex={staticColumnIndex}
							table={table}
						/>
					) : null;
				},
			)}
			{virtualPaddingRight ? (
				<th style={{ display: "flex", width: virtualPaddingRight }} />
			) : null}
		</TableRow>
	);
};
