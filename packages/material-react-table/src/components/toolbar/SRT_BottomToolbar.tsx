import { alpha } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SRT_LinearProgressBar } from "./SRT_LinearProgressBar";
import { SRT_TablePagination } from "./SRT_TablePagination";
import { SRT_ToolbarAlertBanner } from "./SRT_ToolbarAlertBanner";
import { SRT_ToolbarDropZone } from "./SRT_ToolbarDropZone";
import type { MRT_RowData, MRT_TableInstance } from "../../types";
import { getCommonToolbarStyles } from "../../utils/style.utils";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { cn } from "@/lib/utils";

export interface SRT_BottomToolbarProps<TData extends MRT_RowData> {
	table: MRT_TableInstance<TData>;
	SRTBottomToolbarProps?:
		| ((props: {
				table: MRT_TableInstance<TData>;
		  }) => React.ComponentProps<"div">)
		| React.ComponentProps<"div">;
	renderBottomToolbarCustom?: (props: {
		table: MRT_TableInstance<TData>;
		defaultToolbar: React.ReactNode;
	}) => React.ReactNode;
}

export const SRT_BottomToolbar = <TData extends MRT_RowData>({
	table,
	...rest
}: SRT_BottomToolbarProps<TData>) => {
	const {
		getState,
		options: {
			enablePagination,
			muiBottomToolbarProps,
			positionPagination,
			positionToolbarAlertBanner,
			positionToolbarDropZone,
			renderBottomToolbarCustomActions,
		},
		refs: { bottomToolbarRef },
	} = table;
	const {
		SRTBottomToolbarProps: xxxBottomToolbarProps,
		renderBottomToolbarCustom,
	} = rest;
	const { isFullScreen } = getState();

	const isMobile = useMediaQuery("(max-width:720px)");

	// Default Tailwind container styles
	const defaultContainerProps: React.ComponentPropsWithoutRef<"div"> = {
		className: cn(
			"bottom-toolbar bg-white p-2 shadow",
			isFullScreen ? "fixed bottom-0 left-0 right-0" : "relative",
		),
	};

	// Evaluate user provided container props (if function, call it)
	const userContainerProps =
		typeof xxxBottomToolbarProps === "function"
			? xxxBottomToolbarProps({ table })
			: (xxxBottomToolbarProps ?? {});

	// Merge default props with user overrides
	const containerProps: React.ComponentPropsWithoutRef<"div"> = {
		...defaultContainerProps,
		...userContainerProps,
		className: cn(
			defaultContainerProps.className,
			userContainerProps.className,
		),
	};

	const toolbarProps = {
		...parseFromValuesOrFunc(muiBottomToolbarProps, { table }),
		...rest,
	};

	const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions;

	// Default toolbar content constructed using current table state
	const defaultToolbar = (
		<>
			<SRT_LinearProgressBar isTopToolbar={false} table={table} />
			{positionToolbarAlertBanner === "bottom" && (
				<SRT_ToolbarAlertBanner table={table} />
			)}
			{["both", "bottom"].includes(positionToolbarDropZone ?? "") && (
				<SRT_ToolbarDropZone table={table} />
			)}
			<div className="flex items-center justify-end">
				{renderBottomToolbarCustomActions ? (
					renderBottomToolbarCustomActions({ table })
				) : (
					<span />
				)}
				{enablePagination &&
					["both", "bottom"].includes(positionPagination ?? "") && (
						<SRT_TablePagination position="bottom" table={table} />
					)}
			</div>
		</>
	);

	// Render custom toolbar if provided; otherwise, render default content
	return (
		<div
			{...containerProps}
			ref={(node: HTMLDivElement | null) => {
				if (node) {
					bottomToolbarRef.current = node;
					// Note: avoid assigning to user provided ref if using new patterns.
				}
			}}
		>
			{renderBottomToolbarCustom
				? renderBottomToolbarCustom({ table, defaultToolbar })
				: defaultToolbar}
		</div>
	);
};
