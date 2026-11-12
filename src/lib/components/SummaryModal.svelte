<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { Award, CheckCircle } from 'lucide-svelte';
    import { formatTime } from '$lib/utils';
    import confetti from 'canvas-confetti';

    let { 
        isOpen = $bindable(), 
        sets, 
        reps, 
        avgWork, 
        avgRest, 
        onClose 
    }: { 
        isOpen: boolean, 
        sets: number, 
        reps: number, 
        avgWork: number, 
        avgRest: number,
        onClose: () => void
    } = $props();

    $effect(() => {
        if (isOpen) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#fbbf24', '#ffffff', '#f59e0b']
            });
        }
    });
</script>

{#if isOpen}
    <!-- Backdrop -->
    <button 
        type="button"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300"
        onclick={() => isOpen = false}
        transition:fade
        aria-label="Close modal"
    ></button>

    <!-- Modal -->
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
            class="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md w-full shadow-2xl pointer-events-auto border-t-8 border-t-amber-500"
            transition:scale={{ duration: 300, start: 0.95 }}
        >
            <div class="flex items-center justify-center gap-3 mb-2">
                <Award size={32} class="text-amber-500" />
                <h3 class="text-3xl font-black uppercase text-white italic">Workout Complete</h3>
            </div>
            <p class="text-neutral-400 mb-6 font-medium text-center text-sm">Great job! Here is your performance summary.</p>
            
            <div class="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 mb-6 space-y-4">
                <div class="flex justify-between items-center pb-3 border-b border-neutral-800">
                    <span class="text-neutral-500 font-bold uppercase text-xs tracking-wider">Total Sets</span>
                    <span class="font-black text-white text-xl">{sets}</span>
                </div>
                <div class="flex justify-between items-center pb-3 border-b border-neutral-800">
                    <span class="text-neutral-500 font-bold uppercase text-xs tracking-wider">Total Reps</span>
                    <span class="font-black text-white text-xl">{reps}</span>
                </div>
                <div class="flex justify-between items-center pb-3 border-b border-neutral-800">
                    <span class="text-neutral-500 font-bold uppercase text-xs tracking-wider">Avg Work/Set</span>
                    <span class="font-mono font-black text-amber-500 text-lg">{formatTime(avgWork)}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-neutral-500 font-bold uppercase text-xs tracking-wider">Avg Rest/Set</span>
                    <span class="font-mono font-black text-neutral-300 text-lg">{formatTime(avgRest)}</span>
                </div>
            </div>

            <button 
                onclick={onClose}
                class="w-full py-4 rounded-xl font-black text-black bg-amber-500 hover:bg-amber-400 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
            >
                <CheckCircle size={20} />
                Start New Session
            </button>
        </div>
    </div>
{/if}
