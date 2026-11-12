export function formatTime(totalSeconds: number | null): string {
    if (totalSeconds === null || totalSeconds === undefined) return "--:--";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
