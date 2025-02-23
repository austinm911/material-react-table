//Commented out Material Icons imports replaced with Lucide equivalent.
import {
	ArrowDown as ArrowDownwardIcon,
	ArrowRight as ArrowRightIcon,
	Columns3Icon as ViewColumnIcon,
	// CancelIcon, //There is no direct equivalent in Lucide, but XCircle could be used. Consider if you need it.
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	// ClearAll as ClearAllIcon,
	X as CloseIcon,
	Copy as ContentCopy,
	Rows2Icon as DensityLargeIcon, //Check if this is the right semantic equivalent
	Rows3Icon as DensityMediumIcon, //Check if this is the right semantic equivalent
	Rows4Icon as DensitySmallIcon, //Check if this is the right semantic equivalent
	GripVertical as DragHandleIcon,
	// DynamicFeedIcon, // No direct equivalent. Consider what this icon represents and choose an appropriate Lucide icon.
	Edit as EditIcon,
	ChevronDown as ExpandMoreIcon,
	Filter as FilterAltIcon,
	ListFilterIcon as FilterListIcon,
	FilterXIcon as FilterListOffIcon,
	ChevronsLeft as FirstPageIcon,
	Maximize as FullscreenIcon,
	Minimize as FullscreenExitIcon,
	ChevronsDown as KeyboardDoubleArrowDownIcon, // vertically oriented
	ChevronsRight as LastPageIcon,
	MoreHorizontalIcon,
	MoreVertical as MoreVertIcon,
	Pin as PushPinIcon, //Check this
	RotateCcw as RestartAltIcon,
	Save as SaveIcon,
	Search as SearchIcon,
	SearchSlashIcon as SearchOffIcon,
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
	MoreHorizontalIcon,
	MoreVertIcon,
	PushPinIcon,
	RestartAltIcon,
	SaveIcon,
	SearchIcon,
	SearchOffIcon,
	//SortIcon,
	//SyncAltIcon,
	ColumnsIcon,
	VisibilityOffIcon,
	ViewColumnIcon,
} as const

export type SRT_Icons = Record<keyof typeof SRT_Default_Icons, any>
