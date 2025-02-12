import { type MouseEvent, useState } from "react";
import { Button } from "../ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MRT_TableHeadCellFilterContainer } from "./MRT_TableHeadCellFilterContainer";
import type { MRT_Header, MRT_RowData, MRT_TableInstance } from "../../types";
import {
	getColumnFilterInfo,
	useDropdownOptions,
} from "../../utils/column.utils";
import { getValueAndLabel, parseFromValuesOrFunc } from "../../utils/utils";
import { cn } from "@/lib/utils";

export interface SRT_TableHeadCellFilterLabelProps<TData extends MRT_RowData>
	extends React.ComponentProps<"button"> {
	header: MRT_Header<TData>;
	table: MRT_TableInstance<TData>;
}

export const SRT_TableHeadCellFilterLabel = <TData extends MRT_RowData>({
	header,
	table,
	className,
	...rest
}: SRT_TableHeadCellFilterLabelProps<TData>) => {
	const {
		options: {
			columnFilterDisplayMode,
			icons: { FilterAltIcon },
			localization,
		},
		refs: { filterInputRefs },
		setShowColumnFilters,
	} = table;
	const { column } = header;
	const { columnDef } = column;

	const filterValue = column.getFilterValue() as [string, string] | string;

	const [open, setOpen] = useState(false);

	const {
		currentFilterOption,
		isMultiSelectFilter,
		isRangeFilter,
		isSelectFilter,
	} = getColumnFilterInfo({ header, table });

	const dropdownOptions = useDropdownOptions({ header, table });

	const getSelectLabel = (index?: number) =>
		getValueAndLabel(
			dropdownOptions?.find(
				(option) =>
					getValueAndLabel(option).value ===
					(index !== undefined ? filterValue[index] : filterValue),
			),
		).label;

	const isFilterActive =
		(Array.isArray(filterValue) && filterValue.some(Boolean)) ||
		(!!filterValue && !Array.isArray(filterValue));

	const filterTooltip =
		columnFilterDisplayMode === "popover" && !isFilterActive
			? localization.filterByColumn?.replace(
					"{column}",
					String(columnDef.header),
				)
			: localization.filteringByColumn
					.replace("{column}", String(columnDef.header))
					.replace(
						"{filterType}",
						currentFilterOption
							? localization[
									`filter${
										currentFilterOption.charAt(0).toUpperCase() +
										currentFilterOption.slice(1)
									}` as keyof typeof localization
								]
							: "",
					)
					.replace(
						"{filterValue}",
						`"${
							Array.isArray(filterValue)
								? (filterValue as [string, string])
										.map((value, index) =>
											isMultiSelectFilter ? getSelectLabel(index) : value,
										)
										.join(
											`" ${isRangeFilter ? localization.and : localization.or} "`,
										)
								: isSelectFilter
									? getSelectLabel()
									: (filterValue as string)
						}"`,
					)
					.replace('" "', "");

	const shouldShow =
		columnFilterDisplayMode === "popover" ||
		(!!filterValue && !isRangeFilter) ||
		(isRangeFilter && (!!filterValue?.[0] || !!filterValue?.[1]));

	if (!shouldShow) return null;

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		if (columnFilterDisplayMode === "popover") {
			setOpen(true);
		} else {
			setShowColumnFilters(true);
		}
		queueMicrotask(() => {
			filterInputRefs.current?.[`${column.id}-0`]?.focus?.();
			filterInputRefs.current?.[`${column.id}-0`]?.select?.();
		});
		event.stopPropagation();
	};

	return (
		<span className="flex-none">
			<TooltipProvider>
				<Tooltip>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className={cn(
										"size-4 scale-75 p-2 transition-all duration-150",
										"ml-1",
										isFilterActive ? "opacity-100" : "opacity-30",
										className,
									)}
									onClick={handleClick}
									{...rest}
								>
									<FilterAltIcon />
								</Button>
							</TooltipTrigger>
						</PopoverTrigger>
						<TooltipContent>{filterTooltip}</TooltipContent>
						{columnFilterDisplayMode === "popover" && (
							<PopoverContent
								align="center"
								className="overflow-visible"
								onClick={(e) => e.stopPropagation()}
								onKeyDown={(e) => e.key === "Enter" && setOpen(false)}
							>
								<div className="p-4">
									<MRT_TableHeadCellFilterContainer
										header={header}
										table={table}
									/>
								</div>
							</PopoverContent>
						)}
					</Popover>
				</Tooltip>
			</TooltipProvider>
		</span>
	);
};
