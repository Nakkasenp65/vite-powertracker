<script lang="ts">
  import type { Snippet } from 'svelte';
  
  let { title, value, icon: Icon, color = 'text-amber-500' }: { title: string, value: string | number, icon: any, color?: string } = $props();
</script>

<div class="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-center">
    <span class="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">{title}</span>
    <span class="font-mono font-black {color} text-sm">{value}</span>
</div>
