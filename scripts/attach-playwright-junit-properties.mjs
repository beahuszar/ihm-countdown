import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

// Playwright's junit reporter records attachments as `[[ATTACHMENT|path]]`
// markers inside <system-out>. Bitrise's custom-test-results-export step only
// recognizes <property name="attachment_*" value="path"/> elements. This
// rewrites one into the other so screenshots show up as Test Report attachments.

const junitPath = process.argv[2] ?? 'playwright-results/junit.xml'

if (!existsSync(junitPath)) {
  console.error(`No junit.xml found at ${junitPath}. Run "npm run test:e2e" first.`)
  process.exit(1)
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (name) => ['testsuite', 'testcase', 'property'].includes(name),
})
const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  format: true,
})

const xml = readFileSync(junitPath, 'utf-8')
const doc = parser.parse(xml)

const testsuites = doc.testsuites?.testsuite ?? []
for (const testsuite of testsuites) {
  for (const testcase of testsuite.testcase ?? []) {
    const systemOut = testcase['system-out']
    if (typeof systemOut !== 'string') continue

    const attachments = [...systemOut.matchAll(/\[\[ATTACHMENT\|([^\]]+)\]\]/g)].map((m) => m[1])
    if (attachments.length === 0) continue

    testcase.properties ??= { property: [] }
    attachments.forEach((attachmentPath, index) => {
      testcase.properties.property.push({
        '@_name': `attachment_${index}`,
        '@_value': attachmentPath,
      })
    })
  }
}

writeFileSync(junitPath, builder.build(doc))
console.log(`Rewrote attachment properties in ${junitPath}`)
