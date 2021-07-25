import { Section, SectionStatus } from '../../Model/Sections'
import RailsMock from './RailsMock'

export default class SectionMocks implements Section {
  Id: number
  Rails: RailsMock[]
  FromSection: number
  ToSection: number
  Status: SectionStatus

  constructor(id: number) {
    this.Id = id
    this.Rails = []
    this.FromSection = 0
    this.ToSection = 0
    this.Status = SectionStatus.Red
  }

  get RailAmount() { return this.Rails.length }
}
