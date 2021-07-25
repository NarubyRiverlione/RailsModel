import { Section } from '../../Model/Sections'
import Train from '../../Model/Train'

export default class TrainMock implements Train {
  Name: string
  Id: number
  MaxSpeed: number
  CurrentSpeed: number
  OnSection?: Section
  OnFieldNr: number
  Running: boolean
  Braking: boolean
  TraveledDistance: number
  NextStationId: number

  constructor(name: string, id: number, maxSpeed: number, currentSpeed = 0) {
    this.Name = name
    this.Id = id
    this.OnFieldNr = -1
    this.MaxSpeed = maxSpeed
    this.CurrentSpeed = currentSpeed
    this.Running = false
    this.Braking = false
    this.TraveledDistance = 0
    this.NextStationId = 0
  }

  SetOnSection(onSection: Section, startFieldNr: number) { }
  Thick(): void { }
}
