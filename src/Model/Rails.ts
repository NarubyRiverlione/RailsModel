import { makeAutoObservable } from 'mobx'
import Direction from './Direction'

export type Rail = {
  X: number,
  Y: number,
  Direction: Direction
  TrainID: number
  Collision: boolean
  Entrance: boolean
  Exit: boolean
}

export default class Rails implements Rail {
  X: number
  Y: number
  Direction: Direction
  TrainID: number
  Collision: boolean
  Entrance: boolean
  Exit: boolean

  constructor(X: number, Y: number, direction = Direction.None) {
    this.X = X
    this.Y = Y
    this.Direction = direction
    this.TrainID = 0
    this.Collision = false
    this.Entrance = false
    this.Exit = false
    makeAutoObservable(this)
  }

  OccupyBeTrain(trainID: number) {
    if (this.Direction === Direction.None) return
    if (this.TrainID !== trainID && this.TrainID !== 0) this.Collision = true
    this.TrainID = trainID
  }
  ClearCollision() {
    this.Collision = false
    this.TrainID = 0
  }
}
