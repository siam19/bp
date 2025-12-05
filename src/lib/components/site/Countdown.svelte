<script lang="ts">
	let { targetDate, label = 'Ends in' } = $props<{ targetDate: Date; label?: string }>();

	let timeLeft = $state({ days: 0, hours: 0, mins: 0, secs: 0 });

	function updateTimer() {
		const now = new Date();
		const diff = targetDate.getTime() - now.getTime();

		if (diff <= 0) {
			timeLeft = { days: 0, hours: 0, mins: 0, secs: 0 };
			return;
		}

		timeLeft = {
			days: Math.floor(diff / (1000 * 60 * 60 * 24)),
			hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
			mins: Math.floor((diff / 1000 / 60) % 60),
			secs: Math.floor((diff / 1000) % 60)
		};
	}

	$effect(() => {
		updateTimer();
		const interval = setInterval(updateTimer, 1000);
		return () => clearInterval(interval);
	});
</script>

<div class="flex flex-col items-center justify-center gap-2 text-white">
	<span class="text-sm font-bold uppercase tracking-widest text-gray-400">{label}</span>
	<div class="flex items-baseline gap-1 font-mono text-3xl font-bold tabular-nums sm:text-4xl">
		<div class="flex flex-col items-center">
			<span>{String(timeLeft.days).padStart(2, '0')}</span>
			<span class="text-[10px] font-normal text-gray-500">DAYS</span>
		</div>
		<span class="text-gray-600">:</span>
		<div class="flex flex-col items-center">
			<span>{String(timeLeft.hours).padStart(2, '0')}</span>
			<span class="text-[10px] font-normal text-gray-500">HRS</span>
		</div>
		<span class="text-gray-600">:</span>
		<div class="flex flex-col items-center">
			<span>{String(timeLeft.mins).padStart(2, '0')}</span>
			<span class="text-[10px] font-normal text-gray-500">MIN</span>
		</div>
		<span class="text-gray-600">:</span>
		<div class="flex flex-col items-center">
			<span>{String(timeLeft.secs).padStart(2, '0')}</span>
			<span class="text-[10px] font-normal text-gray-500">SEC</span>
		</div>
	</div>
</div>
