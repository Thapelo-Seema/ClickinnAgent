export interface FileUpload{
	file: any;
	path: string;
	url: string;
	name: string;
	progress: number;
	loaded?: boolean;
}