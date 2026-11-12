<script lang="ts">
  import type { HistoryRecord } from '$lib/types';
  import { formatTime } from '$lib/utils';
  import { Flame, Timer, Target, Trash2 } from 'lucide-svelte';

  let { record, onDelete }: { record: HistoryRecord, onDelete?: (set: number) => void } = $props();
</script>

<div class="group bg-neutral-950 rounded-xl p-3 shadow-sm border border-neutral-800 flex items-center justify-between transition-all hover:border-amber-500/50 hover:shadow-[0_0_10px_rgba(245,158,11,0.1)] relative">
    <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black shrink-0 shadow-inner">
            {record.set}
        </div>
        <div class="flex flex-col text-left hidden sm:flex">
            <span class="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Set</span>
        </div>
    </div>
    
    <div class="flex gap-4 sm:gap-6 text-right items-center">
        <div class="flex flex-col items-end w-12 sm:w-16">
            <span class="text-[10px] sm:text-xs text-neutral-500 uppercase font-bold tracking-wider flex items-center gap-1">
                <Flame size={12} class="text-amber-500" /> Work
            </span>
            <span class="font-mono font-bold text-white text-sm">
                {formatTime(record.work)}
            </span>
        </div>
        <div class="flex flex-col items-end w-12 sm:w-16 border-l border-neutral-800 pl-4 sm:pl-6">
            <span class="text-[10px] sm:text-xs text-neutral-500 uppercase font-bold tracking-wider flex items-center gap-1">
                <Timer size={12} class="text-neutral-400" /> Rest
            </span>
            <span class="font-mono font-bold text-neutral-300 text-sm">
                {record.rest !== null ? formatTime(record.rest) : '--:--'}
            </span>
        </div>
        <div class="flex flex-col items-end w-10 sm:w-12 border-l border-neutral-800 pl-4 sm:pl-6">
            <span class="text-[10px] sm:text-xs text-neutral-500 uppercase font-bold tracking-wider flex items-center gap-1">
                <Target size={12} class="text-amber-500/70" /> Reps
            </span>
            <span class="font-black text-white text-sm">
                {record.reps !== null ? record.reps : '-'}
            </span>
        </div>

        {#if onDelete}
            <button 
                onclick={() => onDelete(record.set)}
                class="ml-2 p-2 text-neutral-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Delete set"
            >
                <Trash2 size={16} />
            </button>
        {/if}
    </div>
</div>
