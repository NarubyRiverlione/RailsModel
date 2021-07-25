import { Rail } from '../../Model/Rails'
import { Section, SectionStatus } from '../../Model/Sections'

export default class SectionMocks implements Section {
  Id: number
  FromSection: number
  ToSection: number
  Status: SectionStatus
  private rails: Rail[]

  constructor(id: number) {
    this.Id = id
    this.rails = []
    this.FromSection = 0
    this.ToSection = 0
    this.Status = SectionStatus.Red
  }

  get CountRails() { return this.rails.length }

  GetRail(railNr: number) { return this.rails[railNr] }

  AddRail(addingRail: Rail) {
    this.rails.push(addingRail)
  }
}
