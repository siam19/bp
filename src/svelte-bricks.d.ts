declare module 'svelte-bricks' {
	import { SvelteComponent } from 'svelte';
	export default class Masonry extends SvelteComponent<{
		items: any[];
		minColWidth?: number;
		maxColWidth?: number;
		gap?: number;
		idKey?: string;
		[key: string]: any;
	}> {}
}
