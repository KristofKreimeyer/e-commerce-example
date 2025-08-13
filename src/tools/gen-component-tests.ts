/* Run: node tools/gen-component-tests.ts
 */
import { promises as fs } from 'node:fs'
import { join, dirname, relative, basename } from 'node:path'
import fg from 'fast-glob'

const SRC = 'src'
const TEST_DIR = '__tests__'

const template = (compPath: string, compName: string) => `import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Component from '${compPath}'

describe('${compName}', () => {
  it('renders without crashing (smoke)', () => {
    const wrapper = mount(Component)
    expect(wrapper.exists()).toBe(true)
  })

  it('renders default slot content if any', () => {
    const wrapper = mount(Component, { slots: { default: 'Hello' } })
    // Falls die Komponente Slots rendert, sieht man "Hello", sonst kein Fehler.
    expect(wrapper.text()).toContain('Hello')
  })
})
`

async function main() {
  const files = await fg(`${SRC}/**/*.vue`, { dot: false })
  for (const file of files) {
    const dir = dirname(file)
    const base = basename(file, '.vue')
    const testDir = join(dir, TEST_DIR)
    const testFile = join(testDir, `${base}.spec.ts`)

    try {
      await fs.access(testFile)
      continue
    } catch {}

    await fs.mkdir(testDir, { recursive: true })

    // Importpfad relativ zum Testfile
    const relImport = relative(testDir, file).replace(/\\/g, '/')
    const content = template(relImport.startsWith('.') ? relImport : './' + relImport, base)

    await fs.writeFile(testFile, content, 'utf8')
    console.log('Created', testFile)
  }
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})
