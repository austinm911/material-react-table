//Commented out Material Icons imports replaced with Lucide equivalent.
import {
	ArrowDown as ArrowDownwardIcon,
	ArrowRight as ArrowRightIcon,
	// CancelIcon, //There is no direct equivalent in Lucide, but XCircle could be used. Consider if you need it.
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	// ClearAll as ClearAllIcon,
	X as CloseIcon,
	Copy as ContentCopy,
	LayoutTemplate as DensityLargeIcon, //Check if this is the right semantic equivalent
	LayoutList as DensityMediumIcon, //Check if this is the right semantic equivalent
	Minus as DensitySmallIcon, //Check if this is the right semantic equivalent
	GripVertical as DragHandleIcon,
	// DynamicFeedIcon, // No direct equivalent. Consider what this icon represents and choose an appropriate Lucide icon.
	Edit as EditIcon,
	ChevronDown as ExpandMoreIcon,
	Filter as FilterAltIcon,
	Filter as FilterListIcon, //same as FilterAltIcon
	FilterX as FilterListOffIcon,
	ChevronsLeft as FirstPageIcon,
	Maximize as FullscreenIcon,
	Minimize as FullscreenExitIcon,
	ChevronsDown as KeyboardDoubleArrowDownIcon, // vertically oriented
	ChevronsRight as LastPageIcon,
	MoreHorizontal as MoreHorizIcon,
	MoreVertical as MoreVertIcon,
	Pin as PushPinIcon, //Check this
	RotateCcw as RestartAltIcon,
	Save as SaveIcon,
	Search as SearchIcon,
	SearchSlashIcon,
	//SortIcon,  //If you need a generic sort icon, Lucide has ArrowDownAZ and ArrowUpAZ
	// SyncAltIcon, // Lucide has a few sync-like icons: 'refresh-cw', 'refresh-ccw', 'rotate-cw', 'rotate-ccw'. Choose the best fit.
	ColumnsIcon,
	EyeOff as VisibilityOffIcon,
} from 'lucide-react'

export const SRT_Default_Icons = {
	ArrowDownwardIcon,
	ArrowRightIcon,
	//CancelIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	// ClearAllIcon,
	CloseIcon,
	ContentCopy,
	DensityLargeIcon,
	DensityMediumIcon,
	DensitySmallIcon,
	DragHandleIcon,
	//DynamicFeedIcon,
	EditIcon,
	ExpandMoreIcon,
	FilterAltIcon,
	FilterListIcon,
	FilterListOffIcon,
	FirstPageIcon,
	FullscreenExitIcon,
	FullscreenIcon,
	KeyboardDoubleArrowDownIcon,
	LastPageIcon,
	MoreHorizIcon,
	MoreVertIcon,
	PushPinIcon,
	RestartAltIcon,
	SaveIcon,
	SearchIcon,
	//SearchOffIcon,
	SearchSlashIcon,
	//SortIcon,
	//SyncAltIcon,
	ColumnsIcon,
	VisibilityOffIcon,
} as const

export type SRT_Icons = Record<keyof typeof SRT_Default_Icons, any>
