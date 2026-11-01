export interface StackInit {
  type: 'init'; canvas: OffscreenCanvas; width: number; height: number;
  pixelRatio: number; view: string; reducedMotion: boolean; hidden: boolean;
}
export type StackCommand = StackInit
  | { type: 'view'; view: string; immediate: boolean; reducedMotion: boolean }
  | { type: 'resize'; width: number; height: number }
  | { type: 'pointer'; x: number; y: number }
  | { type: 'visibility'; hidden: boolean };
export type StackReply = { type: 'ready' } | { type: 'fallback' };
