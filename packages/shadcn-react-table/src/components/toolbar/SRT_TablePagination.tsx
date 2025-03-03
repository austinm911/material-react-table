import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { useMediaQuery } from '../../hooks/use-media-query'
import type { SRT_RowData, SRT_TableInstance, PaginationProps, SelectProps } from '../../types-SRT'
import { flipIconStyles } from '../../utils/style.utils'
import { parseFromValuesOrFunc } from '../../utils/utils'

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100]

export interface SRT_TablePaginationProps<TData extends SRT_RowData>
	extends Partial<
		PaginationProps & {
			SelectProps?: Partial<SelectProps>
			disabled?: boolean
			rowsPerPageOptions?: { label: string; value: number }[] | number[]
			showRowsPerPage?: boolean
			showFirstButton?: boolean
			showLastButton?: boolean
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

	// Create a custom pagination component for 'pages' mode
	const renderCustomPagination = () => {
		// Generate page numbers
		const pageNumbers = []
		for (let i = 1; i <= numberOfPages; i++) {
			pageNumbers.push(i)
		}

		return (
			<Pagination className="mx-auto">
				<PaginationContent>
					{showFirstButton && (
						<PaginationItem>
							{!disableBack ? (
								<PaginationLink
									onClick={() => table.firstPage()}
									aria-label={localization.goToFirstPage}
								>
									<FirstPageIcon className="h-4 w-4" />
								</PaginationLink>
							) : (
								<span className="opacity-50 cursor-not-allowed">
									<PaginationLink
										aria-disabled="true"
										aria-label={localization.goToFirstPage}
										onClick={(e) => e.preventDefault()}
									>
										<FirstPageIcon className="h-4 w-4" />
									</PaginationLink>
								</span>
							)}
						</PaginationItem>
					)}
					<PaginationItem>
						{!disableBack ? (
							<PaginationPrevious
								onClick={() => table.previousPage()}
								aria-label={localization.goToPreviousPage}
							/>
						) : (
							<span className="opacity-50 cursor-not-allowed">
								<PaginationPrevious
									aria-disabled="true"
									aria-label={localization.goToPreviousPage}
									onClick={(e) => e.preventDefault()}
								/>
							</span>
						)}
					</PaginationItem>

					{pageNumbers.map((page) => (
						<PaginationItem key={page}>
							<PaginationLink
								isActive={page === pageIndex + 1}
								onClick={() => table.setPageIndex(page - 1)}
								aria-label={`Page ${page}`}
							>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}

					<PaginationItem>
						{!disableNext ? (
							<PaginationNext onClick={() => table.nextPage()} aria-label={localization.goToNextPage} />
						) : (
							<span className="opacity-50 cursor-not-allowed">
								<PaginationNext
									aria-disabled="true"
									aria-label={localization.goToNextPage}
									onClick={(e) => e.preventDefault()}
								/>
							</span>
						)}
					</PaginationItem>
					{showLastButton && (
						<PaginationItem>
							{!disableNext ? (
								<PaginationLink onClick={() => table.lastPage()} aria-label={localization.goToLastPage}>
									<LastPageIcon className="h-4 w-4" />
								</PaginationLink>
							) : (
								<span className="opacity-50 cursor-not-allowed">
									<PaginationLink
										aria-disabled="true"
										aria-label={localization.goToLastPage}
										onClick={(e) => e.preventDefault()}
									>
										<LastPageIcon className="h-4 w-4" />
									</PaginationLink>
								</span>
							)}
						</PaginationItem>
					)}
				</PaginationContent>
			</Pagination>
		)
	}

	return (
		<div
			className={`flex flex-wrap items-center gap-2 sm:justify-center md:justify-between relative px-2 py-3 z-[2] ${
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
				renderCustomPagination()
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
											<FirstPageIcon className="h-4 w-4" />
										</Button>
									</span>
								</TooltipTrigger>
								<TooltipContent>{localization.goToFirstPage}</TooltipContent>
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
										<ChevronLeftIcon className="h-4 w-4" />
									</Button>
								</span>
							</TooltipTrigger>
							<TooltipContent>{localization.goToPreviousPage}</TooltipContent>
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
										<ChevronRightIcon className="h-4 w-4" />
									</Button>
								</span>
							</TooltipTrigger>
							<TooltipContent>{localization.goToNextPage}</TooltipContent>
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
											<LastPageIcon className="h-4 w-4" />
										</Button>
									</span>
								</TooltipTrigger>
								<TooltipContent>{localization.goToLastPage}</TooltipContent>
							</Tooltip>
						)}
					</div>
				</>
			) : null}
		</div>
	)
}
