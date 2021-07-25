export enum PlaceType {
  None = 0,
  Entrance = 1,
  Exit = 2,
  Station = 3,
}

export type Place = {
  Name: string
  Type: PlaceType
}

export default class Places implements Place {
  Name: string
  Type: PlaceType
  constructor(name: string, type: PlaceType) {
    this.Name = name
    this.Type = type
  }
}
