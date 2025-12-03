const fs = require('fs')
const path = require('path')

function main() {
  const srcPath = path.join(process.cwd(), 'country_codes_raw.json')
  const destPath = path.join(process.cwd(), 'src', 'constants', 'countryDialCodes.ts')
  const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
  const result = data
    .map((country) => {
      const root = country.idd && country.idd.root
      const suffixes = (country.idd && country.idd.suffixes) || []
      if (!root) return null
      let dialCode = ''
      if (!suffixes.length || suffixes[0] === '' || suffixes.length > 20) {
        dialCode = root
      } else {
        dialCode = `${root}${suffixes[0]}`
      }
      return {
        name: country.name?.common || country.name?.official || 'Unknown',
        code: country.cca2 || '',
        dialCode
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))

  const output = `export const COUNTRY_DIAL_CODES = ${JSON.stringify(result, null, 2)} as const;\n\nexport type CountryDialCode = (typeof COUNTRY_DIAL_CODES)[number];\n`

  fs.writeFileSync(destPath, output)
  console.log(`Wrote ${result.length} country dial codes to ${destPath}`)
}

main()
