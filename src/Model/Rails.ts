import { makeAutoObservable } from 'mobx'
import Direction from './Direction'
import Places, { Place } from './Places'
import { CstRail } from '../Cst'

export type Rail = {
  X: number,
  Y: number,
  Direction: Direction
  Collision: boolean
  ByPlace: Place
  OccupyBeTrain: (trainID: number) => void
  SetEmpty: () => void
  GetTrain: number
  IsEmpty: boolean
  NextToStationId: number
}

export default class Rails implements Rail {
  X: number
  Y: number
  Direction: Direction
  ByPlace: Place
  Collision: boolean
  private trainID: number

  constructor(X: number, Y: number, direction = Direction.None) {
    this.X = X
    this.Y = Y
    this.Direction = direction
    this.Collision = false
    this.ByPlace = new Places()
    this.trainID = CstRail.Empty
    makeAutoObservable(this)
  }
  get GetTrain() { return this.trainID }
  get IsEmpty() { return this.trainID === CstRail.Empty }
  get NextToStationId() { return this.ByPlace.Id }

  OccupyBeTrain(trainID: number) {
    if (this.Direction === Direction.None) return
    if (this.trainID !== trainID && this.trainID !== CstRail.Empty) this.Collision = true
    this.trainID = trainID
  }
  SetEmpty() { this.trainID = CstRail.Empty }

  ClearCollision() {
    this.Collision = false
    this.SetEmpty()
  }
}
