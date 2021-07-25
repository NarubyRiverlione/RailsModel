import { promises as fsPromises } from 'fs'
import { Rail } from './Rails'
import Sections, { Section } from './Sections'
import Train from './Train'

export interface Track {
  Name: string
  readonly sections: Section[]
  Trains: Train[]
  AddSection: (addedSection: Section) => void
}

export default class Tracks implements Track {
  Name: string
  readonly sections: Section[]
  Trains: Train[]

  constructor() {
    this.Name = ''
    this.sections = []
    this.Trains = []
  }

  get SectionAmount() { return this.sections.length }

  AddSection(addedSection: Section) {
    this.sections.push(addedSection)
  }

  ParseJson(trackFile: string) {
    const trackObj = JSON.parse(trackFile.toString())
    this.Name = trackObj.Name
    // trackObj.sections.forEach((readSection: Section) => {
    //   const addingSection: Section = { ...readSection }
    //   this.AddSection(addingSection)
    // })

    trackObj.sections.forEach((readSection: any) => {
      // parse loaded section
      const addingSection = new Sections(readSection.Id)
      addingSection.Status = readSection.Status
      addingSection.FromSection = readSection.FromSection
      addingSection.ToSection = readSection.ToSection

      readSection.rails.forEach((readRail: Rail) => {
        // add rail to section, bypass the Direction calc
        addingSection.AddRail(readRail, true)
      })
      // add completed parsed section to trace
      this.AddSection(addingSection)
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
