import { makeAutoObservable } from 'mobx'
import Rails, { Rail } from './Rails'
import {
  ConnectionFromPrevious, Position, DirectionByPosition,
} from './Direction'
import { CstError } from '../Cst'

const { SectionError } = CstError

export enum SectionStatus {
  Green,
  Orange,
  Red,
  Unknown,
}

export type Section = {
  Id: number
  Rails: Rail[]
  FromSection: number
  ToSection: number
  Status: SectionStatus
}

export default class Sections implements Section {
  Id: number
  Rails: Rail[]
  FromSection: number
  ToSection: number
  Status: SectionStatus

  constructor(id: number) {
    this.Id = id
    this.Rails = []
    this.FromSection = 0
    this.ToSection = 0
    this.Status = SectionStatus.Unknown
    makeAutoObservable(this)
  }

  AddRail(addField: Rail) {
    // only add entrance to empty section that isn't connected to other section
    if (this.Rails.length === 0 && addField.Entrance && this.FromSection === 0) {
      this.Rails.push(addField); return
    }
    // don't add rail to empty section that that's not connected and doesn't have an entrance
    if (this.Rails.length === 0 && this.FromSection === 0 && !addField.Entrance) {
      throw new Error(SectionError.EmptyNoEntrance)
    }
    //  add first rail to empty section that is  connected to other section
    if (this.Rails.length === 0 && this.FromSection !== 0) {
      this.Rails.push(addField); return
    }

    const previousRail = this.Rails[this.Rails.length - 1]
    const postion = Position(addField.X - previousRail.X, addField.Y - previousRail.Y)
    // own direction
    const newRail = new Rails(addField.X, addField.Y, DirectionByPosition(postion))
    //  if (newRail.Direction === Direction.None) throw new Error(SectionError.NotConnecting)
    // change previous rail to make the connection
    const connection = postion * previousRail.Direction
    // console.log(previousRail.Direction)
    previousRail.Direction = ConnectionFromPrevious(connection)

    this.Rails.push(newRail)
  }
}
