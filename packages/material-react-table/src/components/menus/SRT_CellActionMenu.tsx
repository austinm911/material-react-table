import Menu, { type MenuProps } from "@mui/material/Menu";
import { SRT_ActionMenuItem } from "./SRT_ActionMenuItem";
import type { MRT_RowData, MRT_TableInstance } from "../../types";
import { openEditingCell } from "../../utils/cell.utils";
import { parseFromValuesOrFunc } from "../../utils/utils";

export interface SRT_CellActionMenuProps<TData extends MRT_RowData>
	extends Partial<MenuProps> {
	table: MRT_TableInstance<TData>;
}

export const SRT_CellActionMenu = <TData extends MRT_RowData>({
	table,
	...rest
}: SRT_CellActionMenuProps<TData>) => {
	const {
		getState,
		options: {
			editDisplayMode,
			enableClickToCopy,
			enableEditing,
			icons: { ContentCopy, EditIcon },
			localization,
			mrtTheme: { menuBackgroundColor },
			renderCellActionMenuItems,
		},
		refs: { actionCellRef },
	} = table;
	const { actionCell, density } = getState();
	const cell = actionCell!;
	const { row } = cell;
	const { column } = cell;
	const { columnDef } = column;

	const handleClose = (event?: any) => {
		event?.stopPropagation();
		table.setActionCell(null);
		actionCellRef.current = null;
	};

	const internalMenuItems = [
		(parseFromValuesOrFunc(enableClickToCopy, cell) === "context-menu" ||
			parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) ===
				"context-menu") && (
			<SRT_ActionMenuItem
				icon={<ContentCopy />}
				key={"srt-copy"}
				label={localization.copy}
				onClick={(event) => {
					event.stopPropagation();
					navigator.clipboard.writeText(cell.getValue() as string);
					handleClose();
				}}
				table={table}
			/>
		),
		parseFromValuesOrFunc(enableEditing, row) && editDisplayMode === "cell" && (
			<SRT_ActionMenuItem
				icon={<EditIcon />}
				key={"srt-edit"}
				label={localization.edit}
				onClick={() => {
					openEditingCell({ cell, table });
					handleClose();
				}}
				table={table}
			/>
		),
	].filter(Boolean);

	const renderActionProps = {
		cell,
		closeMenu: handleClose,
		column,
		internalMenuItems,
		row,
		table,
	};

	const menuItems =
		columnDef.renderCellActionMenuItems?.(renderActionProps) ??
		renderCellActionMenuItems?.(renderActionProps);

	return (
		(!!menuItems?.length || !!internalMenuItems?.length) && (
			<Menu
				MenuListProps={{
					dense: density === "compact",
					sx: {
						backgroundColor: menuBackgroundColor,
					},
				}}
				anchorEl={actionCellRef.current}
				disableScrollLock
				onClick={(event) => event.stopPropagation()}
				onClose={handleClose}
				open={!!cell}
				transformOrigin={{ horizontal: -100, vertical: 8 }}
				{...rest}
			>
				{menuItems ?? internalMenuItems}
			</Menu>
		)
	);
};
