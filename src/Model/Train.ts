import { makeAutoObservable } from 'mobx'
import { Section } from './Sections'
import { CstError, CstTrain, CstField } from '../Cst'

const { TrainError } = CstError
export default class Train {
  Name: string
  Id: number
  MaxSpeed: number
  CurrentSpeed: number
  OnSection?: Section
  OnFieldNr: number
  Running: boolean
  Braking: boolean
  TraveledDistance: number

  constructor(name: string, id: number, maxSpeed: number, currentSpeed = 0) {
    this.Name = name
    this.Id = id
    this.MaxSpeed = maxSpeed
    this.CurrentSpeed = currentSpeed
    this.Running = false
    this.Braking = false
    this.TraveledDistance = 0
    // constructor must alway works, set train later on section/field to do  checks
    this.OnFieldNr = -1

    makeAutoObservable(this)
  }

  SetOnSection(onSection: Section, startFieldNr: number) {
    // must be on a valid field in the section
    if (startFieldNr > onSection.RailAmount) {
      throw new Error(`${TrainError.InvalidFieldInSection} ${this.OnFieldNr}/${onSection.RailAmount}`)
    }

    this.OnSection = onSection
    this.OnFieldNr = startFieldNr
    this.OnSection.rails[startFieldNr].TrainID = this.Id
  }

  Thick() {
    if (!this.OnSection) return

    // braking = slowing down until stop
    if (this.Braking) {
      this.Running = false
      this.CurrentSpeed -= CstTrain.Braking
      if (this.CurrentSpeed <= 0) { this.CurrentSpeed = 0; this.Braking = false }
    }

    if (this.Running) {
      // running = speeding up until max speed
      this.CurrentSpeed = this.CurrentSpeed < this.MaxSpeed
        ? this.CurrentSpeed += CstTrain.SpeedingUp : this.MaxSpeed
      // add distance inside the current field
      this.TraveledDistance += this.CurrentSpeed
      if (this.TraveledDistance >= CstField.Length) {
        // check if there is a next field in the section
        if (this.OnFieldNr < this.OnSection.RailAmount - 1) {
          // move to next field, reset traveled distance
          this.TraveledDistance = 0
          // clear current field
          this.OnSection.rails[this.OnFieldNr].TrainID = 0
          // occupy next field
          this.OnFieldNr += 1
          this.OnSection.rails[this.OnFieldNr].TrainID = this.Id
        } else {
          // no next field
          this.CurrentSpeed = 0
          this.Running = false
        }
      }
    }
  }
}
