const looksSame = require('looks-same')
const { promisify } = require('util')
const fs = require('fs')
const readdir = promisify(fs.readdir)
const mkdir = promisify(fs.mkdir)
const createDiff = promisify(looksSame.createDiff)

const [, , date1, date2] = process.argv

const main = async () => {
  const urls = await readdir(`_out/${date1}`)

  for (let url of urls) {
    const filenames = await readdir(`_out/${date1}/${url}`)
    for (let filename of filenames) {
      const pathA = `_out/${date1}/${url}/${filename}`
      const pathB = `_out/${date2}/${url}/${filename}`
      const diffDir = `_out/diff/${date1}vs${date2}/${url}`
      const diffPath = `${diffDir}/${filename}`

      await mkdir(diffDir, { recursive: true })

      createDiff({
        reference: pathA,
        current: pathB,
        diff: diffPath,
        highlightColor: '#ff00ff'
      }).catch(err => console.error(err))
    }
  }
}

// go!
main()
