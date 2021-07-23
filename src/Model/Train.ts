import { makeAutoObservable } from 'mobx'
import { Section } from './Sections'
import { CstError, CstTrain, CstField } from '../Cst'

const { TrainError } = CstError
export default class Train {
  Name: string
  Id: number
  MaxSpeed: number
  CurrentSpeed: number
  OnSection: Section
  FieldNr: number
  Running: boolean
  Braking: boolean
  TraveledDistance: number

  constructor(name: string, id: number, onSection: Section, fieldNr: number, maxSpeed: number, currentSpeed = 0) {
    this.Name = name
    this.Id = id
    this.OnSection = onSection
    this.FieldNr = fieldNr
    this.MaxSpeed = maxSpeed
    this.CurrentSpeed = currentSpeed
    this.Running = false
    this.Braking = false
    this.TraveledDistance = 0

    // set train on section
    if (fieldNr > this.OnSection.Rails.length) {
      throw new Error(`${TrainError.InvalidFieldInSection + fieldNr}/${this.OnSection.Rails.length}`)
    }
    this.OnSection.Rails[fieldNr].TrainID = id

    makeAutoObservable(this)
  }

  Thick() {
    // no next field = stop train
    if (this.FieldNr === this.OnSection.Rails.length - 1) {
      this.CurrentSpeed = 0
    }
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
        if (this.FieldNr < this.OnSection.Rails.length) {
          // move to next field, reset traveled distance
          this.TraveledDistance = 0
          // clear current field
          this.OnSection.Rails[this.FieldNr].TrainID = 0
          // occupy next field
          this.FieldNr += 1
          this.OnSection.Rails[this.FieldNr].TrainID = this.Id
        }
      }
    }
  }
}
