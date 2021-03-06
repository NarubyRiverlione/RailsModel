import { makeAutoObservable } from 'mobx'
import { Rail } from './Rails'
import {
  ConnectionFromPrevious, Position, DirectionByPosition,
} from './Direction'
import { CstError } from '../Cst'
import { PlaceType } from './Places'

const { SectionError } = CstError

export enum SectionStatus {
  Green,
  Orange,
  Red,
  Unknown,
}

export interface Section {
  Id: number
  FromSection: number
  ToSection: number
  Status: SectionStatus
  CountRails: number

  GetRail: (railNr: number) => Rail
  AddRail: (addingRail: Rail, bypassDirectionCalc?: boolean) => void
}

export default class Sections implements Section {
  Id: number
  FromSection: number
  ToSection: number
  Status: SectionStatus
  private rails: Rail[]

  constructor(id: number) {
    this.Id = id
    this.rails = []
    this.FromSection = 0
    this.ToSection = 0
    this.Status = SectionStatus.Unknown
    makeAutoObservable(this)
  }
  get CountRails() { return this.rails.length }

  GetRail(railNr: number) { return this.rails[railNr] }

  AddRail(addingRail: Rail, bypassDirectionCalc = false) {
    // when adding rail from a saved json track file, don't change the Direction
    if (bypassDirectionCalc) { this.rails.push(addingRail); return }

    // only add entrance to empty section that isn't connected to other section
    if (this.rails.length === 0 && addingRail.ByPlace.Type === PlaceType.Entrance && this.FromSection === 0) {
      this.rails.push(addingRail); return
    }
    // don't add rail to empty section that that's not connected and doesn't have an entrance
    if (this.rails.length === 0 && this.FromSection === 0 && addingRail.ByPlace.Type !== PlaceType.Entrance) {
      throw new Error(SectionError.EmptyNoEntrance)
    }
    //  add first rail to empty section that is  connected to other section
    if (this.rails.length === 0 && this.FromSection !== 0) {
      this.rails.push(addingRail); return
    }
    const previousRail = this.rails[this.rails.length - 1]
    const postion = Position(addingRail.X - previousRail.X, addingRail.Y - previousRail.Y)
    // set calculated direction, don't use constructor because there are other fields (ex. Exit)
    const newRail: Rail = { ...addingRail, Direction: DirectionByPosition(postion) }
    // change previous rail to make the connection
    const connection = postion * previousRail.Direction
    // console.log(previousRail.Direction)
    previousRail.Direction = ConnectionFromPrevious(connection)

    this.rails.push(newRail)
  }
}
