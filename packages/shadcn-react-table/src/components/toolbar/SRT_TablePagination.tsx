import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Pagination } from '@/components/ui/pagination'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { SRT_RowData, SRT_TableInstance, PaginationProps, SelectProps } from '../../types-SRT'
import { flipIconStyles, getCommonTooltipProps } from '../../utils/style.utils.shadcn'
import { parseFromValuesOrFunc } from '../../utils/utils'

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100]

export interface SRT_TablePaginationProps<TData extends SRT_RowData>
	extends Partial<
		PaginationProps & {
			SelectProps?: Partial<SelectProps>
			disabled?: boolean
			rowsPerPageOptions?: { label: string; value: number }[] | number[]
			showRowsPerPage?: boolean
		}
	> {
	position?: 'bottom' | 'top'
	table: SRT_TableInstance<TData>
}

export const SRT_TablePagination = <TData extends SRT_RowData>({
	position = 'bottom',
	table,
	...rest
}: SRT_TablePaginationProps<TData>) => {
	const theme = useTheme()
	const isMobile = useMediaQuery('(max-width: 720px)')

	const {
		getState,
		options: {
			enableToolbarInternalActions,
			icons: { ChevronLeftIcon, ChevronRightIcon, FirstPageIcon, LastPageIcon },
			id,
			localization,
			shadcnPaginationProps,
			paginationDisplayMode,
		},
	} = table
	const {
		pagination: { pageIndex = 0, pageSize = 10 },
	} = getState()

	const paginationProps = {
		...parseFromValuesOrFunc(shadcnPaginationProps, { table }),
		...rest,
	}

	const totalRowCount = table.getRowCount()
	const numberOfPages = table.getPageCount()
	const showFirstLastPageButtons = numberOfPages > 2
	const firstRowIndex = pageIndex * pageSize
	const lastRowIndex = Math.min(pageIndex * pageSize + pageSize, totalRowCount)

	const {
		SelectProps = {},
		disabled = false,
		rowsPerPageOptions = defaultRowsPerPage,
		showFirstButton = showFirstLastPageButtons,
		showLastButton = showFirstLastPageButtons,
		showRowsPerPage = true,
		...restPaginationProps
	} = paginationProps ?? {}

	const disableBack = pageIndex <= 0 || disabled
	const disableNext = lastRowIndex >= totalRowCount || disabled

	// Instead of mutating the SelectProps, use a local flag
	const nativeSelect = isMobile && SelectProps?.native !== false

	const tooltipProps = getCommonTooltipProps()

	return (
		<div
			className={`MuiTablePagination-root flex flex-wrap items-center gap-2 sm:justify-center md:justify-between relative px-2 py-3 z-[2] ${
				position === 'top' && enableToolbarInternalActions ? 'mt-12' : ''
			}`}
		>
			{showRowsPerPage && (
				<div className="flex items-center gap-2">
					<Label htmlFor={`srt-rows-per-page-${id}`} className="mb-0">
						{localization.rowsPerPage}
					</Label>
					{nativeSelect ? (
						<select
							aria-label={localization.rowsPerPage}
							id={`srt-rows-per-page-${id}`}
							disabled={disabled}
							value={pageSize}
							onChange={(event) => table.setPageSize(+event.target.value)}
							className="mb-0"
						>
							{SelectProps?.children
								? SelectProps.children
								: rowsPerPageOptions.map((option: any) => {
										const value = typeof option !== 'number' ? option.value : option
										const label = typeof option !== 'number' ? option.label : `${option}`
										return (
											<option key={value} value={value}>
												{label}
											</option>
										)
									})}
						</select>
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger className="mb-0">{pageSize}</DropdownMenuTrigger>
							<DropdownMenuContent>
								{SelectProps?.children
									? SelectProps.children
									: rowsPerPageOptions.map((option: any) => {
											const value = typeof option !== 'number' ? option.value : option
											const label = typeof option !== 'number' ? option.label : `${option}`
											return (
												<DropdownMenuItem key={value} onSelect={() => table.setPageSize(value)}>
													{label}
												</DropdownMenuItem>
											)
										})}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			)}
			{paginationDisplayMode === 'pages' ? (
				<Pagination
					count={numberOfPages}
					disabled={disabled}
					currentPage={pageIndex + 1}
					onPageChange={(newPage) => table.setPageIndex(newPage - 1)}
					firstPageIcon={<FirstPageIcon {...flipIconStyles(theme)} />}
					previousPageIcon={<ChevronLeftIcon {...flipIconStyles(theme)} />}
					nextPageIcon={<ChevronRightIcon {...flipIconStyles(theme)} />}
					lastPageIcon={<LastPageIcon {...flipIconStyles(theme)} />}
					showFirstButton={showFirstButton}
					showLastButton={showLastButton}
					{...restPaginationProps}
				/>
			) : paginationDisplayMode === 'default' ? (
				<>
					<span style={{ margin: '0 4px', minWidth: '8ch', textAlign: 'center' }}>
						{`${lastRowIndex === 0 ? 0 : (firstRowIndex + 1).toLocaleString()}-${lastRowIndex.toLocaleString()} ${
							localization.of
						} ${totalRowCount.toLocaleString()}`}
					</span>
					<div className="flex gap-2">
						{showFirstButton && (
							<Tooltip>
								<TooltipTrigger asChild>
									<span>
										<Button
											aria-label={localization.goToFirstPage}
											disabled={disableBack}
											onClick={() => table.firstPage()}
											size="icon"
											variant="outline"
										>
											<FirstPageIcon {...flipIconStyles(theme)} />
										</Button>
									</span>
								</TooltipTrigger>
								<TooltipContent {...tooltipProps}>{localization.goToFirstPage}</TooltipContent>
							</Tooltip>
						)}
						<Tooltip>
							<TooltipTrigger asChild>
								<span>
									<Button
										aria-label={localization.goToPreviousPage}
										disabled={disableBack}
										onClick={() => table.previousPage()}
										size="icon"
										variant="outline"
									>
										<ChevronLeftIcon {...flipIconStyles(theme)} />
									</Button>
								</span>
							</TooltipTrigger>
							<TooltipContent {...tooltipProps}>{localization.goToPreviousPage}</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<span>
									<Button
										aria-label={localization.goToNextPage}
										disabled={disableNext}
										onClick={() => table.nextPage()}
										size="icon"
										variant="outline"
									>
										<ChevronRightIcon {...flipIconStyles(theme)} />
									</Button>
								</span>
							</TooltipTrigger>
							<TooltipContent {...tooltipProps}>{localization.goToNextPage}</TooltipContent>
						</Tooltip>
						{showLastButton && (
							<Tooltip>
								<TooltipTrigger asChild>
									<span>
										<Button
											aria-label={localization.goToLastPage}
											disabled={disableNext}
											onClick={() => table.lastPage()}
											size="icon"
											variant="outline"
										>
											<LastPageIcon {...flipIconStyles(theme)} />
										</Button>
									</span>
								</TooltipTrigger>
								<TooltipContent {...tooltipProps}>{localization.goToLastPage}</TooltipContent>
							</Tooltip>
						)}
					</div>
				</>
			) : null}
		</div>
	)
}
