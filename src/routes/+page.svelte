<script lang="ts">
    import { Zap, Target, Flag, RotateCcw, Activity, Play, Pause, Flame } from 'lucide-svelte';
    import type { HistoryRecord, Phase } from '$lib/types';
    import { formatTime } from '$lib/utils';
    import StatCard from '$lib/components/StatCard.svelte';
    import HistoryItem from '$lib/components/HistoryItem.svelte';
    import ResetModal from '$lib/components/ResetModal.svelte';
    import SummaryModal from '$lib/components/SummaryModal.svelte';
    import { onMount, onDestroy } from 'svelte';
    import { scale, fade } from 'svelte/transition';

    // --- State ---
    let phase = $state<Phase>('idle');
    let currentSet = $state(1);
    let timeElapsed = $state(0);
    let historyList = $state<HistoryRecord[]>([]);
    let repsInputValue = $state('');
    
    let isResetModalOpen = $state(false);
    let isSummaryModalOpen = $state(false);
    
    let timerInterval: any = null;
    let isMounted = $state(false);

    // --- Persistence ---
    onMount(() => {
        isMounted = true;
        const saved = localStorage.getItem('power-tracker-session');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                phase = data.phase;
                currentSet = data.currentSet;
                historyList = data.historyList;
                // Don't restore timeElapsed to avoid confusion, or could restore if timestamp saved
                if (phase === 'working' || phase === 'resting') {
                    startTimer();
                }
            } catch (e) {
                console.error("Failed to restore session", e);
            }
        }

        // Keyboard Shortcuts
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    $effect(() => {
        if (isMounted) {
            localStorage.setItem('power-tracker-session', JSON.stringify({
                phase,
                currentSet,
                historyList
            }));
        }
    });

    // --- Derived Stats ---
    const stats = $derived.by(() => {
        if (historyList.length === 0) return { avgWork: 0, avgRest: 0, totalReps: 0, setsWithRest: 0 };
        
        let totalWorkTime = 0;
        let totalRestTime = 0;
        let setsWithRest = 0;
        let totalRepsCount = 0;

        historyList.forEach(record => {
            totalWorkTime += record.work;
            if (record.rest !== null) {
                totalRestTime += record.rest;
                setsWithRest++;
            }
            if (record.reps !== null) {
                totalRepsCount += record.reps;
            }
        });

        return {
            avgWork: Math.round(totalWorkTime / historyList.length),
            avgRest: setsWithRest > 0 ? Math.round(totalRestTime / setsWithRest) : 0,
            totalReps: totalRepsCount,
            setsWithRest: setsWithRest
        };
    });

    // --- Actions ---
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeElapsed++;
        }, 1000);
    }

    function stopTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
    }

    function handleAction() {
        triggerHaptic();
        if (phase === 'idle') {
            phase = 'working';
            timeElapsed = 0;
            startTimer();
        } else if (phase === 'working') {
            const reps = repsInputValue !== '' ? parseInt(repsInputValue, 10) : null;
            repsInputValue = '';

            historyList = [{ set: currentSet, work: timeElapsed, rest: null, reps: reps }, ...historyList];
            phase = 'resting';
            timeElapsed = 0;
            startTimer();
        } else if (phase === 'resting') {
            if (historyList.length > 0) {
                historyList[0].rest = timeElapsed;
            }
            currentSet++;
            phase = 'working';
            timeElapsed = 0;
            startTimer();
        }
    }

    function handleFinish() {
        triggerHaptic();
        stopTimer();
        
        if (phase === 'resting' && historyList.length > 0) {
            historyList[0].rest = timeElapsed;
        } else if (phase === 'working') {
            const reps = repsInputValue !== '' ? parseInt(repsInputValue, 10) : null;
            repsInputValue = '';
            historyList = [{ set: currentSet, work: timeElapsed, rest: null, reps: reps }, ...historyList];
        }

        isSummaryModalOpen = true;
        phase = 'finished';
    }

    function deleteSet(setNumber: number) {
        historyList = historyList.filter(h => h.set !== setNumber);
        // Recalculate set numbers to keep them sequential
        historyList = historyList.map((h, i) => ({ ...h, set: historyList.length - i }));
        currentSet = historyList.length + (phase === 'working' ? 1 : 0);
    }

    function resetSession() {
        stopTimer();
        phase = 'idle';
        currentSet = 1;
        timeElapsed = 0;
        historyList = [];
        repsInputValue = '';
        isResetModalOpen = false;
        isSummaryModalOpen = false;
        localStorage.removeItem('power-tracker-session');
    }

    function triggerHaptic() {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.target instanceof HTMLInputElement) return;

        if (e.code === 'Space') {
            e.preventDefault();
            handleAction();
        } else if (e.key === 'r' || e.key === 'R') {
            isResetModalOpen = true;
        } else if (e.key === 'f' || e.key === 'F') {
            if (phase !== 'idle') handleFinish();
        }
    }

    onDestroy(() => {
        stopTimer();
    });

    // --- UI Helpers ---
    const statusPillText = $derived.by(() => {
        if (phase === 'idle') return "Ready to Start";
        if (phase === 'working') return `Active: Set ${currentSet}`;
        if (phase === 'resting') return `Resting (Next: Set ${currentSet + 1})`;
        return "Session Complete";
    });

    const themeClass = $derived.by(() => {
        if (phase === 'resting') return 'from-slate-900 to-blue-950';
        return 'from-neutral-900 to-black';
    });

    const accentColor = $derived.by(() => {
        if (phase === 'resting') return 'text-blue-400';
        return 'text-amber-400';
    });

    const actionBtnContent = $derived.by(() => {
        if (phase === 'working') return { text: "Finish & Rest", icon: Pause };
        if (phase === 'idle') return { text: `Start Set 1`, icon: Play };
        return { text: `Start Set ${currentSet + 1}`, icon: Flame };
    });
</script>

<svelte:head>
    <title>Power Tracker | Modern Workout Tool</title>
</svelte:head>

<div class="bg-gradient-to-br {themeClass} font-sans text-gray-900 min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-700">
    
    <!-- Background Decor -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-24 -left-24 w-96 h-96 {phase === 'resting' ? 'bg-blue-500/10' : 'bg-amber-500/10'} rounded-full blur-3xl transition-colors duration-700"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 {phase === 'resting' ? 'bg-indigo-500/10' : 'bg-orange-500/10'} rounded-full blur-3xl transition-colors duration-700"></div>
    </div>

    <!-- Main Layout Container -->
    <div class="w-full max-w-5xl flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-stretch relative z-10">
        
        <!-- Left Side: Timer & Controls -->
        <div class="w-full md:w-1/2 flex flex-col items-center justify-center text-white p-4">
            
            <!-- Title -->
            <div class="flex items-center justify-center gap-3 mb-10 group">
                <Zap size={32} class="text-amber-400 fill-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] group-hover:scale-110 transition-transform" />
                <h1 class="text-4xl font-black tracking-tight italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Power Tracker</h1>
            </div>

            <!-- Status Pill -->
            <div class="mb-4">
                <span class="inline-block px-5 py-2 rounded-full bg-white/5 backdrop-blur-sm {accentColor} font-bold text-sm mb-4 border border-current/20 uppercase tracking-widest shadow-sm transition-colors duration-500">
                    {statusPillText}
                </span>
            </div>

            <!-- Timer Display -->
            <div class="text-8xl md:text-9xl font-black tracking-tighter mb-8 font-mono drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] {phase === 'working' ? 'animate-timer-pulse' : ''}">
                {formatTime(timeElapsed)}
            </div>

            <!-- Reps Input Container -->
            {#if phase === 'working'}
                <div 
                    transition:scale={{ duration: 300, start: 0.95 }}
                    class="w-full max-w-sm mb-6 transition-all duration-300 origin-bottom"
                >
                    <label for="reps-input" class="block text-amber-400/90 text-xs font-bold uppercase tracking-widest mb-2 text-center">
                        Reps Completed (Optional)
                    </label>
                    <div class="relative flex items-center justify-center">
                        <Target size={20} class="absolute left-4 text-gray-400" />
                        <input 
                            type="number" 
                            id="reps-input" 
                            bind:value={repsInputValue}
                            min="0" 
                            placeholder="e.g. 10" 
                            class="w-full pl-12 pr-4 py-3 rounded-2xl border-none text-center text-xl font-black text-white bg-white/10 shadow-inner focus:ring-2 focus:ring-amber-400/50 outline-none transition-all placeholder:text-gray-500 placeholder:font-normal backdrop-blur-md"
                            onkeydown={(e) => e.key === 'Enter' && handleAction()}
                        >
                    </div>
                </div>
            {/if}

            <!-- Primary Action Button -->
            <button 
                onclick={handleAction}
                class="w-full max-w-sm py-5 rounded-2xl text-xl font-black uppercase tracking-wider transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 
                {phase === 'working' ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 
                 phase === 'resting' ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' :
                 'bg-amber-500 text-black hover:bg-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] border border-amber-400/50'}"
            >
                <actionBtnContent.icon size={28} class="fill-current" />
                {actionBtnContent.text}
            </button>

            <!-- Secondary Actions: Finish & Reset -->
            <div class="flex items-center justify-center gap-8 mt-8">
                {#if phase !== 'idle' && phase !== 'finished'}
                    <button 
                        onclick={handleFinish}
                        class="flex items-center justify-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors uppercase text-sm tracking-wider"
                    >
                        <Flag size={16} />
                        Finish Workout
                    </button>
                {/if}
                <button 
                    onclick={() => isResetModalOpen = true}
                    class="flex items-center justify-center gap-2 text-white/50 hover:text-white font-semibold transition-colors uppercase text-sm tracking-wider"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>
            </div>
            
            <p class="mt-8 text-[10px] text-neutral-500 uppercase tracking-[0.2em] font-bold">
                Space: Toggle | F: Finish | R: Reset
            </p>
        </div>

        <!-- Stats / History Section (Right Side Window) -->
        <div class="bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 w-full md:w-1/2 flex flex-col h-[500px] md:h-[580px] relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 {phase === 'resting' ? 'bg-blue-500/5' : 'bg-amber-500/5'} rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 transition-colors duration-700"></div>
            <div class="flex items-center gap-2 mb-4 text-white shrink-0">
                <Activity size={20} class="text-amber-500" />
                <h2 class="text-lg font-black uppercase tracking-wide">Session Stats</h2>
            </div>
            
            <!-- History List -->
            <div class="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                {#each historyList as record (record.set)}
                    <div transition:scale={{ duration: 200 }}>
                        <HistoryItem {record} onDelete={deleteSet} />
                    </div>
                {:else}
                    <div class="text-center py-10 text-neutral-500 italic font-medium">
                        Complete a set to see your stats here.
                    </div>
                {/each}
            </div>

            <!-- Live Averages Section -->
            {#if historyList.length > 0}
                <div 
                    transition:fade
                    class="mt-2 pt-4 border-t border-neutral-800 shrink-0"
                >
                    <h3 class="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3 text-center">Live Averages</h3>
                    <div class="grid grid-cols-3 gap-2">
                        <StatCard title="Avg Work" value={formatTime(stats.avgWork)} icon={Zap} />
                        <StatCard title="Avg Rest" value={stats.setsWithRest > 0 ? formatTime(stats.avgRest) : '--:--'} icon={RotateCcw} color="text-neutral-300" />
                        <StatCard title="Total Reps" value={stats.totalReps > 0 ? stats.totalReps : '-'} icon={Target} color="text-white" />
                    </div>
                </div>
            {/if}
        </div>
    </div>

    <!-- Modals -->
    <ResetModal bind:isOpen={isResetModalOpen} onConfirm={resetSession} />
    <SummaryModal 
        bind:isOpen={isSummaryModalOpen} 
        sets={historyList.length} 
        reps={stats.totalReps} 
        avgWork={stats.avgWork} 
        avgRest={stats.avgRest} 
        onClose={resetSession} 
    />

</div>

<style>
    /* Custom Scrollbar */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #262626;
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #404040;
    }
    
    /* Hide number input spinners */
    input[type=number]::-webkit-inner-spin-button, 
    input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
    }

    @keyframes timer-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.9; transform: scale(0.98); }
    }

    .animate-timer-pulse {
        animation: timer-pulse 2s infinite ease-in-out;
    }
</style>
