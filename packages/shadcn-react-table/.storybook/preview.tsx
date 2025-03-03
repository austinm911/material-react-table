import React, { useEffect, useState } from 'react'
import { addons } from '@storybook/preview-api'
import type { Preview } from '@storybook/react'
import { useDarkMode, DARK_MODE_EVENT_NAME } from 'storybook-dark-mode'
import '../src/styles/globals.css'
import { cn } from '../src/lib/utils'

const channel = addons.getChannel()

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
	decorators: [
		(Story, context) => {
			const [isDark, setDark] = useState(true)

			useEffect(() => {
				const sbRoot = document.getElementsByClassName('sb-show-main')[0] as HTMLElement
				channel.on(DARK_MODE_EVENT_NAME, setDark)
				if (sbRoot) {
					sbRoot.style.backgroundColor = isDark ? '#1e1e1e' : '#ffffff'
				}
				return () => channel.off(DARK_MODE_EVENT_NAME, setDark)
			}, [isDark])

			useEffect(() => {
				if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') return
				const script = document.createElement('script')
				script.src = 'https://plausible.io/js/script.js'
				script.setAttribute('data-domain', 'material-react-table.dev')
				script.defer = true

				document.body.appendChild(script)
				return () => {
					document.body.removeChild(script)
				}
			}, [])

			return (
				<div className={cn('p-4', isDark ? 'dark' : '')}>
					<div className="mb-4">
						<p className="text-sm text-muted-foreground mb-2">
							Looking for the main docs site? Click{' '}
							<a
								href="https://www.material-react-table.com"
								target="_blank"
								rel="noreferrer noopener"
								className="text-primary hover:underline"
							>
								here.
							</a>
						</p>
						<p className="text-sm text-muted-foreground">
							View Source code for these examples in the code tab below or{' '}
							<a
								href="https://github.com/KevinVandy/material-react-table/tree/v3/packages/material-react-table/stories/features"
								target="_blank"
								rel="noreferrer noopener"
								className="text-primary hover:underline"
							>
								here on GitHub.
							</a>
						</p>
					</div>
					<Story {...context} />
				</div>
			)
		},
	],
}

export default preview
