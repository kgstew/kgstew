#!/usr/bin/env node
/**
 * Standalone leak scan.
 *
 * The loader already runs this at build time, but for a public repository the
 * moment that matters is the *push*, not the deploy — by the time a build
 * fails, the content is already on GitHub. This is what the pre-commit hook
 * calls.
 */
import { allProjects } from '../lib/content/projects.js'

try {
  const projects = allProjects()
  console.log(`✓ ${projects.length} project(s) scanned, no redacted terms found`)
} catch (err) {
  console.error(`\n✗ ${err.message}\n`)
  process.exit(1)
}
