import { Section, SectionStatus } from '../../Model/Sections'
import RailsMock from './RailsMock'

export default class SectionMocks implements Section {
  Id: number
  FromSection: number
  ToSection: number
  Status: SectionStatus
  private rails: RailsMock[]

  constructor(id: number) {
    this.Id = id
    this.rails = []
    this.FromSection = 0
    this.ToSection = 0
    this.Status = SectionStatus.Red
  }

  get CountRails() { return this.rails.length }

  GetRail(railNr: number) { return this.rails[railNr] }

  AddRail(addRail: RailsMock) {
    this.rails.push(addRail)
  }
}
