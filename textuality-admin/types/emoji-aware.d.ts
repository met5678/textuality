declare module 'emoji-aware' {
  export function onlyEmoji(input: string): string[];
  export function withoutEmoji(input: string): string[];
}
