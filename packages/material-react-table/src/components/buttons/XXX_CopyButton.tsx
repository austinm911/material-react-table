import { type MouseEvent, useState } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from "../../types";
import { parseFromValuesOrFunc } from "../../utils/utils";

export interface XXX_CopyButtonProps<TData extends MRT_RowData>
	extends React.ComponentProps<"button"> {
	cell: MRT_Cell<TData>;
	table: MRT_TableInstance<TData>;
}

export const XXX_CopyButton = <TData extends MRT_RowData>({
	cell,
	table,
	...rest
}: XXX_CopyButtonProps<TData>) => {
	const {
		options: { localization, muiCopyButtonProps },
	} = table;
	const { column, row } = cell;
	const { columnDef } = column;

	const [copied, setCopied] = useState(false);

	const handleCopy = (event: MouseEvent<HTMLButtonElement>, text: unknown) => {
		event.stopPropagation();
		navigator.clipboard.writeText(text as string);
		setCopied(true);
		setTimeout(() => setCopied(false), 4000);
	};

	// Merge additional props from table and column def
	const buttonProps = {
		...parseFromValuesOrFunc(muiCopyButtonProps, { cell, column, row, table }),
		...parseFromValuesOrFunc(columnDef.muiCopyButtonProps, {
			cell,
			column,
			row,
			table,
		}),
		...rest,
	};

	const tooltipContent =
		buttonProps?.title ??
		(copied ? localization.copiedToClipboard : localization.clickToCopy);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					onClick={(e) => handleCopy(e, cell.getValue())}
					{...buttonProps}
				>
					{buttonProps.children}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="top">{tooltipContent}</TooltipContent>
		</Tooltip>
	);
};
