<script lang="ts">
    import { fade, scale } from 'svelte/transition';
    import { AlertTriangle } from 'lucide-svelte';

    let { isOpen = $bindable(), onConfirm }: { isOpen: boolean, onConfirm: () => void } = $props();
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
            class="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl pointer-events-auto"
            transition:scale={{ duration: 300, start: 0.95 }}
        >
            <div class="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertTriangle size={32} />
            </div>
            <h3 class="text-2xl font-black uppercase text-white mb-2 text-center">Reset Session?</h3>
            <p class="text-neutral-400 mb-8 font-medium text-center text-sm">All your current sets, times, and reps will be permanently deleted.</p>
            <div class="flex gap-3">
                <button 
                    onclick={() => isOpen = false} 
                    class="flex-1 py-3 rounded-xl font-bold text-white bg-neutral-800 hover:bg-neutral-700 transition-colors uppercase tracking-wide text-sm border border-neutral-700"
                >
                    Cancel
                </button>
                <button 
                    onclick={onConfirm}
                    class="flex-1 py-3 rounded-xl font-bold text-black bg-red-500 hover:bg-red-400 transition-colors uppercase tracking-wide text-sm"
                >
                    Yes, Reset
                </button>
            </div>
        </div>
    </div>
{/if}
