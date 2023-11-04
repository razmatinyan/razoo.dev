import type { ModalError, ModalErrorComposable } from '../types/error.d';
import { useState } from '#imports';

/**
 * Composable for controling modal errors
 * @returns errors - useState reactive object with {isError, reasons} properties
 * @returns add() - function to add error to reasons array
 * @returns empty() - function to clear the reasons array
 */
export function useModalError(): ModalErrorComposable {
	const errors = useState<ModalError>('errors', () => ({
		isError: false,
		reasons: [],
	}));

	function add(error: string | undefined): void {
		if (errors.value.isError === false) errors.value.isError = true;
		errors.value.reasons?.push(error);
	}

	function empty(): void {
		errors.value.reasons = [];
	}

	return {
		errors,
		add,
		empty,
	};
}
