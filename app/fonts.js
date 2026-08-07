import localFont from 'next/font/local'

/**
 * `adjustFontFallback` is what makes `display: 'swap'` non-destructive — Next
 * generates a metric-matched fallback face with size-adjust and ascent
 * overrides, so the swap doesn't reflow the page.
 *
 * `swap` rather than `optional`: on a portfolio most visitors arrive once, and
 * `optional` means they'd never see the typeface at all.
 */

export const display = localFont({
  src: './fonts/Jost.woff2',
  variable: '--font-jost',
  weight: '100 900',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

export const text = localFont({
  src: './fonts/Newsreader.woff2',
  variable: '--font-newsreader',
  weight: '400 700',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
})

export const mono = localFont({
  src: './fonts/MartianMono.woff2',
  variable: '--font-martian',
  weight: '300 700',
  display: 'swap',
  adjustFontFallback: 'Arial',
})

export const fontVariables = [display.variable, text.variable, mono.variable].join(' ')
