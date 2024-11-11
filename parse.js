import doxygen from 'doxygen'
import fs from 'fs/promises'
import path from 'path'
import xmlReader from 'xml-reader'
import xmlQuery from 'xml-query'
import { log } from 'console'
import util from 'util'

const args = process.argv.slice(2)
if (args.length === 0) {
  throw new Error("Please provide the path to the B2B.sln file!")
}
let [projectBasePath] = args
if (projectBasePath.endsWith('B2B.sln')){
  projectBasePath = projectBasePath.substring(0, projectBasePath.length - 'B2B.sln'.length)
}

if (!doxygen.isDoxygenExecutableInstalled()) {
  console.log("Doxygen is not installed yet. hang on...")
  await doxygen.downloadVersion()
  console.log("Done!")
}
// create a config file
const userOptions = {
  OUTPUT_DIRECTORY: "output",
  PROJECT_NAME: "Clientsettings",
  INPUT: `${projectBasePath}/B2B/Code/ClientObjects/ClientSettings.cs`,
  RECURSIVE: "NO",
  FILE_PATTERNS: ["*.cs"],
  GENERATE_XML: "YES",
  GENERATE_LATEX: "NO",
  GENERATE_HTML: "NO",
}
doxygen.createConfig(userOptions)

console.log("Running doxygen to generate XML...")
doxygen.run()
console.log("Done!")


console.log("Parsing the XML docs...")
// Get refid from index.html
const indexXMLQuery = await getIndexXMLQuery()
const filename = indexXMLQuery.find('compound').attr('refid')

const clientObjectsQuery = await getClientObjectsQuery(filename)
const settings = clientObjectsQuery.find('memberdef').map((m) => {
  if (xmlQuery(m).attr('kind') !== 'property') {
    return null
  }
  const name = xmlQuery(m).find('name').text() 
  const summary = xmlQuery(m).find('briefdescription').text()
  const remarks = xmlQuery(m).find('detaileddescription').text()

  return {
    name,
    summary,
    remarks
  }
}).filter(Boolean)

console.log("Done!")
console.log("Cleanup...")

await fs.rm('config')
await fs.rm(path.join('output', 'xml'), { recursive: true })
console.log("Done!")

console.log("Writing markdown...")

const parsedContents = settings.map((s) => {
  return `
## ${s.name}
${s.summary}
${s.remarks}
---
  `
})
fs.writeFile(path.join('output', 'clientsettings.md'), parsedContents.join('\n'))

console.log("Done. See the generated file:")
console.log(path.join(process.cwd(), 'output', 'clientsettings.md'))


async function getIndexXMLQuery() {
  const filePath = path.join('output', 'xml', 'index.xml')
  const contents = await fs.readFile(filePath, 'utf8')

  const ast = xmlReader.parseSync(contents)
  return xmlQuery(ast)
}

async function getClientObjectsQuery(filename) {
  const filePath = path.join('output', 'xml', `${filename}.xml`)
  const contents = await fs.readFile(filePath, 'utf8')

  const ast = xmlReader.parseSync(contents)
  return xmlQuery(ast)
}