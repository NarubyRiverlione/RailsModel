import { Rail } from '../../Model/Rails'
import Direction from '../../Model/Direction'
import Places, { Place } from '../../Model/Places'
import { CstRail } from '../../Cst'

export default class RailsMock implements Rail {
  X: number
  Y: number
  Direction: Direction
  Collision: boolean
  ByPlace: Place
  private trainID: number

  constructor(X: number, Y: number, direction = Direction.None) {
    this.X = X
    this.Y = Y
    this.Direction = direction
    this.Collision = false
    this.ByPlace = new Places()
    this.trainID = 0
  }
  get GetTrain() { return this.trainID }
  get IsEmpty() { return this.trainID === CstRail.Empty }
  get NextToStationId() { return 0 }

  OccupyBeTrain(trainID: number) { this.trainID = trainID }
  SetEmpty() { this.trainID = CstRail.Empty }
}
