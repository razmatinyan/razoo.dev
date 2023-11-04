export interface ModalError {
	isError: boolean;
	reasons?: Array<string | undefined>;
}
export interface ModalErrorComposable {
	errors: globalThis.Ref<ModalError>;
	add: (error: string | undefined) => void;
	empty: () => void;
}
