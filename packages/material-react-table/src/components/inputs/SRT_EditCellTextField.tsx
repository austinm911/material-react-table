import {
	type ChangeEvent,
	type FocusEvent,
	type KeyboardEvent,
	useState,
	useRef,
	useEffect,
} from "react";
import { Input } from "../../components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import type { MRT_Cell, MRT_RowData, MRT_TableInstance } from "../../types";
import { getValueAndLabel, parseFromValuesOrFunc } from "../../utils/utils";
import type { InputProps } from "@/types-SRT";

export interface SRT_EditCellTextFieldProps<TData extends MRT_RowData>
	extends InputProps {
	cell: MRT_Cell<TData>;
	table: MRT_TableInstance<TData>;
}

export const SRT_EditCellTextField = <TData extends MRT_RowData>({
	cell,
	table,
}: SRT_EditCellTextFieldProps<TData>) => {
	const {
		getState,
		options: { createDisplayMode, editDisplayMode, muiEditTextFieldProps },
		refs: { editInputRefs },
		setCreatingRow,
		setEditingCell,
		setEditingRow,
	} = table;
	const { column, row } = cell;
	const { columnDef } = column;
	const { creatingRow, editingRow } = getState();
	const { editSelectOptions, editVariant } = columnDef;

	const isCreating = creatingRow?.id === row.id;
	const isEditing = editingRow?.id === row.id;

	const [value, setValue] = useState<string | null>(
		() => cell.getValue<string>() ?? null,
	);
	const [completesComposition, setCompletesComposition] = useState(true);
	const [open, setOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current && isEditing) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	const textFieldProps = {
		...parseFromValuesOrFunc(muiEditTextFieldProps, {
			cell,
			column,
			row,
			table,
		}),
		...parseFromValuesOrFunc(columnDef.muiEditTextFieldProps, {
			cell,
			column,
			row,
			table,
		}),
	};

	const selectOptions = parseFromValuesOrFunc(editSelectOptions, {
		cell,
		column,
		row,
		table,
	});

	const isSelectEdit = editVariant === "select" || textFieldProps?.select;

	const saveInputValueToRowCache = (newValue: string | null) => {
		//@ts-expect-error
		row._valuesCache[column.id] = newValue;
		if (isCreating) {
			setCreatingRow(row);
		} else if (isEditing) {
			setEditingRow(row);
		}
	};

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		textFieldProps.onChange?.(event);
		setValue(event.target.value);
		if (isSelectEdit) {
			saveInputValueToRowCache(event.target.value);
		}
	};

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		textFieldProps.onBlur?.(event);
		saveInputValueToRowCache(value);
		setEditingCell(null);
		setOpen(false);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		textFieldProps.onKeyDown?.(event);
		if (event.key === "Enter" && !event.shiftKey && completesComposition) {
			inputRef.current?.blur();
		}
	};

	if (columnDef.Edit) {
		return <>{columnDef.Edit?.({ cell, column, row, table })}</>;
	}

	if (isSelectEdit) {
		return (
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Input
						ref={inputRef}
						aria-label={columnDef.header}
						className="cursor-default"
						disabled={
							parseFromValuesOrFunc(columnDef.enableEditing, row) === false
						}
						placeholder={
							!["custom", "modal"].includes(
								(isCreating ? createDisplayMode : editDisplayMode) as string,
							)
								? columnDef.header
								: undefined
						}
						value={value ?? ""}
						onBlur={handleBlur}
						onChange={handleChange}
						onClick={(e) => {
							e.stopPropagation();
							textFieldProps?.onClick?.(e);
						}}
						onKeyDown={handleKeyDown}
						onCompositionStart={() => setCompletesComposition(false)}
						onCompositionEnd={() => setCompletesComposition(true)}
						{...textFieldProps}
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="p-2">
					{selectOptions?.map((option) => {
						const { label, value: optionValue } = getValueAndLabel(option);
						return (
							<DropdownMenuItem
								key={optionValue}
								onSelect={() => {
									setValue(optionValue);
									saveInputValueToRowCache(optionValue);
									setOpen(false);
									inputRef.current?.blur();
								}}
							>
								{label}
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}

	return (
		<Input
			ref={inputRef}
			aria-label={columnDef.header}
			disabled={parseFromValuesOrFunc(columnDef.enableEditing, row) === false}
			placeholder={
				!["custom", "modal"].includes(
					(isCreating ? createDisplayMode : editDisplayMode) as string,
				)
					? columnDef.header
					: undefined
			}
			value={value ?? ""}
			onBlur={handleBlur}
			onChange={handleChange}
			onClick={(e) => {
				e.stopPropagation();
				textFieldProps?.onClick?.(e);
			}}
			onKeyDown={handleKeyDown}
			onCompositionStart={() => setCompletesComposition(false)}
			onCompositionEnd={() => setCompletesComposition(true)}
			{...textFieldProps}
		/>
	);
};
