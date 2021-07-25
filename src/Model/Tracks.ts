import { promises as fsPromises } from 'fs'
import Sections, { Section } from './Sections'
import Train from './Train'

export type Track = {
  Name: string
  Sections: Section[]
  Trains: Train[]
}

export default class Tracks implements Track {
  Name: string
  Sections: Section[]
  Trains: Train[]

  constructor() {
    this.Name = ''
    this.Sections = []
    this.Trains = []
  }

  get SectionAmount() { return this.Sections.length }

  ParseJson(trackFile: string) {
    const trackObj = JSON.parse(trackFile.toString())
    this.Name = trackObj.Name

    trackObj.Sections.forEach((section: Section, index: number) => {
      // add section
      this.Sections.push(new Sections(section.Id))

      section.Rails.forEach((rail) => {
        // add rail to section
        this.Sections[index].Rails.push(rail)
      })
    })
  }

  async Read(FileName: string) {
    // try {
    const trackFile = await fsPromises.readFile(FileName)
    this.ParseJson(trackFile.toString())
    // } catch (error) {
    //   console.error(error.message)
    // }
  }

  async Save(FileName: string) {
    const trackTxt = JSON.stringify(this)
    await fsPromises.writeFile(FileName, trackTxt)
  }

  Thick() {
    this.Trains.forEach((train) => { train.Thick() })
  }
}
