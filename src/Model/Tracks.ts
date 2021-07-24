import { promises as fsPromises } from 'fs'
import { Section } from './Sections'

export type Track = {
  Name: string
  Sections: Section[]
}

export default class Tracks implements Track {
  Name: string
  Sections: Section[]

  constructor() {
    this.Name = ''
    this.Sections = []
  }

  ParseJson(trackFile: string) {
    const trackObj = JSON.parse(trackFile.toString())
    this.Name = trackObj.Name
    this.Sections = trackObj.Sections
  }

  async Read(FileName: string) {
    try {
      const trackFile = await fsPromises.readFile(FileName)
      this.ParseJson(trackFile.toString())
    } catch (error) {
      console.error(error.message)
    }
  }

  async Save(FileName: string) {
    const trackTxt = JSON.stringify(this)
    await fsPromises.writeFile(FileName, trackTxt)
  }
}
