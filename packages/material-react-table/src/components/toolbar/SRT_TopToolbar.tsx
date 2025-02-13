import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SRT_LinearProgressBar } from "./SRT_LinearProgressBar";
import { SRT_TablePagination } from "./SRT_TablePagination";
import { SRT_ToolbarAlertBanner } from "./SRT_ToolbarAlertBanner";
import { SRT_ToolbarDropZone } from "./SRT_ToolbarDropZone";
import { SRT_ToolbarInternalButtons } from "./SRT_ToolbarInternalButtons";
import type { MRT_RowData, MRT_TableInstance } from "../../types";
import { getCommonToolbarStyles } from "../../utils/style.utils";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { MRT_GlobalFilterTextField } from "../inputs/MRT_GlobalFilterTextField";

export interface SRT_TopToolbarProps<TData extends MRT_RowData> {
	table: MRT_TableInstance<TData>;
}

export const SRT_TopToolbar = <TData extends MRT_RowData>({
	table,
}: SRT_TopToolbarProps<TData>) => {
	const {
		getState,
		options: {
			enableGlobalFilter,
			enablePagination,
			enableToolbarInternalActions,
			muiTopToolbarProps,
			positionGlobalFilter,
			positionPagination,
			positionToolbarAlertBanner,
			positionToolbarDropZone,
			renderTopToolbarCustomActions,
		},
		refs: { topToolbarRef },
	} = table;

	const { isFullScreen, showGlobalFilter } = getState();

	const isMobile = useMediaQuery("(max-width:720px)");
	const isTablet = useMediaQuery("(max-width:1024px)");

	const toolbarProps = parseFromValuesOrFunc(muiTopToolbarProps, { table });

	const stackAlertBanner =
		isMobile ||
		!!renderTopToolbarCustomActions ||
		(showGlobalFilter && isTablet);

	const globalFilterProps = {
		sx: !isTablet
			? {
					zIndex: 2,
				}
			: undefined,
		table,
	};

	return (
		<Box
			{...toolbarProps}
			ref={(ref: HTMLDivElement) => {
				topToolbarRef.current = ref;
				if (toolbarProps?.ref) {
					// @ts-expect-error
					toolbarProps.ref.current = ref;
				}
			}}
			sx={(theme) => ({
				...getCommonToolbarStyles({ table, theme }),
				position: isFullScreen ? "sticky" : "relative",
				top: isFullScreen ? "0" : undefined,
				...(parseFromValuesOrFunc(toolbarProps?.sx, theme) as any),
			})}
		>
			{positionToolbarAlertBanner === "top" && (
				<SRT_ToolbarAlertBanner
					stackAlertBanner={stackAlertBanner}
					table={table}
				/>
			)}
			{["both", "top"].includes(positionToolbarDropZone ?? "") && (
				<SRT_ToolbarDropZone table={table} />
			)}
			<Box
				sx={{
					alignItems: "flex-start",
					boxSizing: "border-box",
					display: "flex",
					gap: "0.5rem",
					justifyContent: "space-between",
					p: "0.5rem",
					position: stackAlertBanner ? "relative" : "absolute",
					right: 0,
					top: 0,
					width: "100%",
				}}
			>
				{enableGlobalFilter && positionGlobalFilter === "left" && (
					<MRT_GlobalFilterTextField {...globalFilterProps} />
				)}
				{renderTopToolbarCustomActions?.({ table }) ?? <span />}
				{enableToolbarInternalActions ? (
					<Box
						sx={{
							alignItems: "center",
							display: "flex",
							flexWrap: "wrap-reverse",
							gap: "0.5rem",
							justifyContent: "flex-end",
						}}
					>
						{enableGlobalFilter && positionGlobalFilter === "right" && (
							<MRT_GlobalFilterTextField {...globalFilterProps} />
						)}
						<SRT_ToolbarInternalButtons table={table} />
					</Box>
				) : (
					enableGlobalFilter &&
					positionGlobalFilter === "right" && (
						<MRT_GlobalFilterTextField {...globalFilterProps} />
					)
				)}
			</Box>
			{enablePagination &&
				["both", "top"].includes(positionPagination ?? "") && (
					<SRT_TablePagination position="top" table={table} />
				)}
			<SRT_LinearProgressBar isTopToolbar table={table} />
		</Box>
	);
};
