import { type ReactNode, useMemo, type MouseEvent } from "react";
import Menu, { type MenuProps } from "@mui/material/Menu";
import { SRT_ActionMenuItem } from "./SRT_ActionMenuItem";
import type { MRT_Row, MRT_RowData, MRT_TableInstance } from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";

export interface SRT_RowActionMenuProps<TData extends MRT_RowData>
	extends Partial<MenuProps> {
	anchorEl: HTMLElement | null;
	handleEdit: (event: MouseEvent) => void;
	row: MRT_Row<TData>;
	setAnchorEl: (anchorEl: HTMLElement | null) => void;
	staticRowIndex?: number;
	table: MRT_TableInstance<TData>;
}

export const SRT_RowActionMenu = <TData extends MRT_RowData>({
	anchorEl,
	handleEdit,
	row,
	setAnchorEl,
	staticRowIndex,
	table,
	...rest
}: SRT_RowActionMenuProps<TData>) => {
	const {
		getState,
		options: {
			editDisplayMode,
			enableEditing,
			icons: { EditIcon },
			localization,
			mrtTheme: { menuBackgroundColor },
			renderRowActionMenuItems,
		},
	} = table;
	const { density } = getState();

	const menuItems = useMemo(() => {
		const items: ReactNode[] = [];
		const editItem = parseFromValuesOrFunc(enableEditing, row) &&
			["modal", "row"].includes(editDisplayMode!) && (
				<SRT_ActionMenuItem
					key={"edit"}
					icon={<EditIcon />}
					label={localization.edit}
					onClick={handleEdit}
					table={table}
				/>
			);
		if (editItem) items.push(editItem);
		const rowActionMenuItems = renderRowActionMenuItems?.({
			closeMenu: () => setAnchorEl(null),
			row,
			staticRowIndex,
			table,
		});
		if (rowActionMenuItems?.length) items.push(...rowActionMenuItems);
		return items;
	}, [renderRowActionMenuItems, row, staticRowIndex, table]);

	if (!menuItems.length) return null;

	return (
		<Menu
			MenuListProps={{
				dense: density === "compact",
				sx: {
					backgroundColor: menuBackgroundColor,
				},
			}}
			anchorEl={anchorEl}
			disableScrollLock
			onClick={(event) => event.stopPropagation()}
			onClose={() => setAnchorEl(null)}
			open={!!anchorEl}
			{...rest}
		>
			{menuItems}
		</Menu>
	);
};
