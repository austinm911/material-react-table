import type { DropdownOption } from '@/types-SRT'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const parseFromValuesOrFunc = <T, U>(fn: ((arg: U) => T) | T | undefined, arg: U): T | undefined =>
	fn instanceof Function ? fn(arg) : fn

export const getValueAndLabel = (option?: DropdownOption | null): { label: string; value: string } => {
	let label = ''
	let value = ''
	if (option) {
		if (typeof option !== 'object') {
			label = option
			value = option
		} else {
			label = option.label ?? option.value
			value = option.value ?? label
		}
	}
	return { label, value }
}
