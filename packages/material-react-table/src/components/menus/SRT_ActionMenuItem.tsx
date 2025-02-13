import type { ReactNode } from 'react'
import { Button } from '../ui/button'
import { DropdownMenuItem } from '../ui/dropdown-menu'
import type { DropdownMenuItemProps, SRT_RowData, SRT_TableInstance } from '../../types-SRT'

export interface SRT_ActionMenuItemProps<TData extends SRT_RowData> extends DropdownMenuItemProps {
	icon: ReactNode
	label: string
	onOpenSubMenu?: (event: React.MouseEvent | React.KeyboardEvent) => void
	table: SRT_TableInstance<TData>
	onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void
}

export const SRT_ActionMenuItem = <TData extends SRT_RowData>({
	icon,
	label,
	onOpenSubMenu,
	table,
	onClick,
	...rest
}: SRT_ActionMenuItemProps<TData>) => {
	const {
		options: {
			icons: { ArrowRightIcon },
		},
	} = table

	return (
		<DropdownMenuItem
			className="flex items-center justify-between min-w-[120px] py-1.5"
			onClick={onClick}
			{...rest}
		>
			<div className="flex items-center gap-2">
				{icon}
				{label}
			</div>
			{onOpenSubMenu && (
				<Button
					variant="ghost"
					size="icon"
					className="p-0 h-auto"
					onClick={onOpenSubMenu}
					onMouseEnter={onOpenSubMenu}
				>
					<ArrowRightIcon className="h-4 w-4" />
				</Button>
			)}
		</DropdownMenuItem>
	)
}
