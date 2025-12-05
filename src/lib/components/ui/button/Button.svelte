<script lang="ts">
	type ButtonVariant = 'default' | 'destructive' | 'outline' | 'ghost';
	type ButtonSize = 'sm' | 'md' | 'lg';

	let {
		variant = 'default',
		size = 'md',
		disabled = false,
		type = 'button',
		class: className = '',
		onclick,
		children
	} = $props<{
		variant?: ButtonVariant;
		size?: ButtonSize;
		disabled?: boolean;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		onclick?: (event: MouseEvent) => void;
		children: any;
	}>();

	const variantClasses: Record<ButtonVariant, string> = {
		default: 'bg-white text-black hover:bg-gray-200 border-transparent',
		destructive: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
		outline: 'bg-transparent text-white border-white/20 hover:bg-white/10',
		ghost: 'bg-transparent text-white hover:bg-white/5 border-transparent'
	};

	const sizeClasses: Record<ButtonSize, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	};

	const baseClasses =
		'inline-flex items-center justify-center font-semibold rounded-lg border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
</script>

<button
	{type}
	{disabled}
	{onclick}
	class="{baseClasses} {variantClasses[variant as ButtonVariant]} {sizeClasses[size as ButtonSize]} {className}"
>
	{@render children()}
</button>
