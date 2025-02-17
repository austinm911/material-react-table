import type * as React from 'react'

import { cn } from '@/lib/utils'

export interface FormHelperTextProps extends React.ComponentProps<'p'> {
	error?: boolean
}

function FormHelperText({ className, children, error = false, ...props }: FormHelperTextProps) {
	return (
		<p {...props} className={cn('text-muted-foreground text-[0.8rem]', error && 'text-destructive', className)}>
			{children}
		</p>
	)
}

export { FormHelperText }
