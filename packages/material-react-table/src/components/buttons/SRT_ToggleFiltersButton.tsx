import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import type { MRT_RowData, MRT_TableInstance } from "../../types";

export interface SRT_ToggleFiltersButtonProps<TData extends MRT_RowData>
	extends IconButtonProps {
	table: MRT_TableInstance<TData>;
}

export const SRT_ToggleFiltersButton = <TData extends MRT_RowData>({
	table,
	...rest
}: SRT_ToggleFiltersButtonProps<TData>) => {
	const {
		getState,
		options: {
			icons: { FilterListIcon, FilterListOffIcon },
			localization,
		},
		setShowColumnFilters,
	} = table;
	const { showColumnFilters } = getState();

	const handleToggleShowFilters = () => {
		setShowColumnFilters(!showColumnFilters);
	};

	return (
		<Tooltip title={rest?.title ?? localization.showHideFilters}>
			<IconButton
				aria-label={localization.showHideFilters}
				onClick={handleToggleShowFilters}
				{...rest}
				title={undefined}
			>
				{showColumnFilters ? <FilterListOffIcon /> : <FilterListIcon />}
			</IconButton>
		</Tooltip>
	);
};
