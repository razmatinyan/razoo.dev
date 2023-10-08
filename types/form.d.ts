export interface InputType {
	type: string;
	modelValue?: string | number;
	placeholder?: string;
}

export interface TextareaType extends InputType {
	rows?: number;
}
