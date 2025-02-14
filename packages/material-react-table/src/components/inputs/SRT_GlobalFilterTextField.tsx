import { type ChangeEvent, type MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Collapsible } from '../ui/collapsible'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'
import type { InputProps, SRT_RowData, SRT_TableInstance } from '../../types-SRT'
import { parseFromValuesOrFunc } from '../../utils/utils'
import { SRT_FilterOptionMenu } from '../menus/SRT_FilterOptionMenu'
import { debounce } from '@mui/material'

export interface SRT_GlobalFilterTextFieldProps<TData extends SRT_RowData> extends InputProps {
	table: SRT_TableInstance<TData>
}

export const SRT_GlobalFilterTextField = <TData extends SRT_RowData>({
	table,
	...rest
}: SRT_GlobalFilterTextFieldProps<TData>) => {
	const {
		getState,
		options: {
			enableGlobalFilterModes,
			icons: { CloseIcon, SearchIcon },
			localization,
			manualFiltering,
			shadcnSearchTextFieldProps, // additional custom props via utils
		},
		refs: { searchInputRef },
		setGlobalFilter,
	} = table
	const { globalFilter, showGlobalFilter } = getState()

	const textFieldProps = {
		...parseFromValuesOrFunc(shadcnSearchTextFieldProps, { table }),
		...rest,
	}

	const isMounted = useRef(false)
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const [searchValue, setSearchValue] = useState(globalFilter ?? '')

	const handleChangeDebounced = useCallback(
		debounce(
			(event: ChangeEvent<HTMLInputElement>) => {
				setGlobalFilter(event.target.value ?? undefined)
			},
			manualFiltering ? 500 : 250,
		),
		[],
	)

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value)
		handleChangeDebounced(event)
	}

	const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClear = () => {
		setSearchValue('')
		setGlobalFilter(undefined)
	}

	useEffect(() => {
		if (isMounted.current) {
			if (globalFilter === undefined) {
				handleClear()
			} else {
				setSearchValue(globalFilter)
			}
		}
		isMounted.current = true
	}, [globalFilter])

	return (
		<Collapsible open={showGlobalFilter}>
			<div className="flex items-center space-x-2">
				{enableGlobalFilterModes ? (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								aria-label={localization.changeSearchMode}
								onClick={handleGlobalFilterMenuOpen}
								className="h-7 w-7"
							>
								<SearchIcon />
							</Button>
						</TooltipTrigger>
						<TooltipContent>{localization.changeSearchMode}</TooltipContent>
					</Tooltip>
				) : (
					<span className="mr-1">
						<SearchIcon />
					</span>
				)}
				<Input
					autoComplete="off"
					placeholder={localization.search}
					value={searchValue ?? ''}
					onChange={handleChange}
					ref={(inputRef) => {
						searchInputRef.current = inputRef
						if (textFieldProps?.inputRef) {
							textFieldProps.inputRef = inputRef
						}
					}}
					{...textFieldProps}
					className={`flex-1 ${textFieldProps.className ?? ''}`}
				/>
				{searchValue?.length ? (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								aria-label={localization.clearSearch}
								disabled={!searchValue?.length}
								onClick={handleClear}
								className="h-7 w-7"
							>
								<CloseIcon />
							</Button>
						</TooltipTrigger>
						<TooltipContent>{localization.clearSearch ?? ''}</TooltipContent>
					</Tooltip>
				) : null}
			</div>
			<SRT_FilterOptionMenu anchorEl={anchorEl} onSelect={handleClear} setAnchorEl={setAnchorEl} table={table} />
		</Collapsible>
	)
}
