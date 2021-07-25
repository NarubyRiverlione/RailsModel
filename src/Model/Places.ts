export enum PlaceType {
  None = 0,
  Entrance = 1,
  Exit = 2,
  Station = 3,
}

export type Place = {
  X: number
  Y: number
  Id: number
  Name: string
  Type: PlaceType
}

export default class Places implements Place {
  X: number
  Y: number
  Name: string
  Id: number
  Type: PlaceType

  constructor(id = -1, name = '', type = PlaceType.None, X = -1, Y = -1) {
    this.X = X
    this.Y = Y
    this.Id = id
    this.Name = name
    this.Type = type
  }
}
