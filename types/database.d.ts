export interface Database {
	public: {
		Tables: {
			project: {
				Row: {
					id: number;
					name: string;
					data: JSON | null;
				};
				Insert: {
					id?: never;
					name: string;
					data?: JSON | null;
				};
				Update: {
					id?: never;
					name?: string;
					data?: JSON | null;
				};
			};
		};
	};
}
