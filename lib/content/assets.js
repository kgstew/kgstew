import fs from 'node:fs'
import path from 'node:path'
import { sortAssets } from '../asset-order.js'

const ASSET_DIR = path.join(process.cwd(), 'content', 'assets')

/**
 * Assets for a project, in canonical hero → process → detail order.
 *
 * Sorted explicitly rather than trusting the manifest's key order — see
 * lib/asset-order.js for why `Object.values` cannot be relied on here.
 */
export function assets(key) {
  if (!key) return []
  const file = path.join(ASSET_DIR, `${key}.json`)
  if (!fs.existsSync(file)) return []
  return sortAssets(JSON.parse(fs.readFileSync(file, 'utf8')).assets)
}

export function assetsByRole(key, role) {
  return assets(key).filter((a) => a.role === role)
}

export function heroAsset(key) {
  return assets(key).find((a) => a.type === 'image' && a.role === 'hero') ?? null
}

/**
 * Look an asset up by its original filename.
 *
 * Asset ids are sha256 prefixes like `ef98d42090`, which nobody will hand-write
 * in prose. captions.yaml is keyed by filename, so this matches how the
 * captions were authored: <Figure project="fable-bound" src="IMG_6613.HEIC" />
 */
export function assetBySource(key, filename) {
  return assets(key).find((a) => a.source === filename) ?? null
}

/** `srcSet` string for one format, or null when the format is absent. */
export function srcSet(asset, format) {
  const list = asset?.variants?.[format]
  if (!list?.length) return null
  return list.map((v) => `${v.url} ${v.w}w`).join(', ')
}

/**
 * A single URL. Kept for OG images and social cards, which want the JPEG.
 * Components that render on-page should use the full variant set instead.
 */
export function assetSrc(asset, width = 1200) {
  const list = asset?.variants?.webp ?? asset?.variants?.jpeg ?? []
  return (list.find((v) => v.w >= width) ?? list.at(-1))?.url ?? null
}

export function ogImage(asset) {
  return asset?.variants?.jpeg?.at(-1)?.url ?? null
}
