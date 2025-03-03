import type * as React from 'react'
import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import { Input } from './input'

// Define variant styles for the input container
export const inputVariants = cva(
	'flex items-center h-10 w-full px-3 py-2 text-sm bg-transparent file:border-0 file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border border-transparent focus-within:outline-none aria-invalid:ring-1 aria-invalid:ring-destructive aria-invalid:focus-within:ring-2 aria-invalid:focus-within:ring-destructive',
	{
		variants: {
			rounded: {
				none: 'rounded-none',
				md: 'rounded-md',
			},
			variant: {
				outline:
					'border-borde focus-within:border-primary focus-within:shadow-[0_0px_0px_1px_hsl(var(--primary))] aria-invalid:border-transparent',
				filled: 'border-2 bg-background focus-within:border-primary focus-within:bg-transparent',
				underlined:
					'rounded-none border-b-border focus-within:border-b-primary focus-within:shadow-[0_1px_0px_0px_hsl(var(--primary))]',
				unstyled: '',
			},
		},
		defaultVariants: {
			rounded: 'md',
			variant: 'outline',
		},
	},
)

export interface InputAdornmentProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {
	/** Content rendered before the input (e.g. text or non-interactive element) */
	startContent?: React.ReactNode
	/** Icon rendered before the input */
	startIcon?: React.ReactNode
	/** Content rendered after the input (e.g. text or non-interactive element) */
	endContent?: React.ReactNode
	/** Icon rendered after the input */
	endIcon?: React.ReactNode
}

/**
 * InputAdornment composes the base Input with optional start and end adornments.
 * You can pass an icon (or any other React node) via `startIcon`/`endIcon`
 * and also add additional content with `startContent`/`endContent`. If both are provided,
 * the icon will show up first followed by the content with a small spacing.
 */
export function InputAdornment({
	className,
	rounded,
	variant,
	startContent,
	endContent,
	startIcon,
	endIcon,
	...props
}: InputAdornmentProps) {
	return (
		<div className={cn(inputVariants({ variant, rounded, className }))}>
			{(startIcon || startContent) && (
				<span className="pointer-events-none flex items-center text-muted-foreground">
					{startIcon}
					{startIcon && startContent && <span className="ml-1">{startContent}</span>}
					{!startIcon && startContent}
				</span>
			)}
			<Input
				{...props}
				className={cn('w-full bg-transparent outline-none focus-visible:outline-none', {
					'pl-1.5': Boolean(startIcon || startContent),
					'pr-1.5': Boolean(endIcon || endContent),
				})}
			/>
			{(endIcon || endContent) && (
				<span className="pointer-events-none flex items-center text-muted-foreground">
					{endIcon}
					{endIcon && endContent && <span className="ml-1">{endContent}</span>}
					{!endIcon && endContent}
				</span>
			)}
		</div>
	)
}
