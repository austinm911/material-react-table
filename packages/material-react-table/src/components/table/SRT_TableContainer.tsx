import { useEffect, useLayoutEffect, useState } from "react";
import TableContainer, {
	type TableContainerProps,
} from "@mui/material/TableContainer";
// Updated imports to use SRT_ versions
import { SRT_Table } from "./SRT_Table";
import { SRT_TableLoadingOverlay } from "./SRT_TableLoadingOverlay";
import type { MRT_RowData, MRT_TableInstance } from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";
import { MRT_CellActionMenu } from "../menus/MRT_CellActionMenu";
import { MRT_EditRowModal } from "../modals/MRT_EditRowModal";

const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Renamed interface to SRT_TableContainerProps
export interface SRT_TableContainerProps<TData extends MRT_RowData>
	extends TableContainerProps {
	table: MRT_TableInstance<TData>;
}

// Renamed export to SRT_TableContainer
export const SRT_TableContainer = <TData extends MRT_RowData>({
	table,
	...rest
}: SRT_TableContainerProps<TData>) => {
	const {
		getState,
		options: {
			createDisplayMode,
			editDisplayMode,
			enableCellActions,
			enableStickyHeader,
			muiTableContainerProps,
		},
		refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
	} = table;
	const {
		actionCell,
		creatingRow,
		editingRow,
		isFullScreen,
		isLoading,
		showLoadingOverlay,
	} = getState();

	const loading =
		showLoadingOverlay !== false && (isLoading || showLoadingOverlay);

	const [totalToolbarHeight, setTotalToolbarHeight] = useState(0);

	const tableContainerProps = {
		...parseFromValuesOrFunc(muiTableContainerProps, {
			table,
		}),
		...rest,
	};

	useIsomorphicLayoutEffect(() => {
		const topToolbarHeight =
			typeof document !== "undefined"
				? (topToolbarRef.current?.offsetHeight ?? 0)
				: 0;

		const bottomToolbarHeight =
			typeof document !== "undefined"
				? (bottomToolbarRef?.current?.offsetHeight ?? 0)
				: 0;

		setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight);
	});

	const createModalOpen = createDisplayMode === "modal" && creatingRow;
	const editModalOpen = editDisplayMode === "modal" && editingRow;

	return (
		<TableContainer
			aria-busy={loading}
			aria-describedby={loading ? "mrt-progress" : undefined}
			{...tableContainerProps}
			ref={(node: HTMLDivElement) => {
				if (node) {
					tableContainerRef.current = node;
					if (tableContainerProps?.ref) {
						// @ts-expect-error
						tableContainerProps.ref.current = node;
					}
				}
			}}
			style={{
				maxHeight: isFullScreen
					? `calc(100vh - ${totalToolbarHeight}px)`
					: undefined,
				...tableContainerProps?.style,
			}}
			sx={(theme) => ({
				maxHeight: enableStickyHeader
					? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
					: undefined,
				maxWidth: "100%",
				overflow: "auto",
				position: "relative",
				...(parseFromValuesOrFunc(tableContainerProps?.sx, theme) as any),
			})}
		>
			{loading ? <SRT_TableLoadingOverlay table={table} /> : null}
			<SRT_Table table={table} />
			{(createModalOpen || editModalOpen) && (
				<MRT_EditRowModal open table={table} />
			)}
			{enableCellActions && actionCell && <MRT_CellActionMenu table={table} />}
		</TableContainer>
	);
};
