import { Rail } from '../../Model/Rails'
import Direction from '../../Model/Direction'

export default class RailsMock implements Rail {
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
  }
}
