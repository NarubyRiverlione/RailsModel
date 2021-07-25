import Rails from '../Model/Rails'
import Direction, { Position } from '../Model/Direction'
import { PlaceType } from '../Model/Places'

describe('New rail', () => {
  it('New rail is empty, no place beside', () => {
    const newRail = new Rails(1, 2)
    expect(newRail.ByPlace.Type).toBe(PlaceType.None)
    expect(newRail.IsEmpty).toBeTruthy()
    expect(newRail.Collision).toBeFalsy()
  })
})

describe('Location', () => {
  it('X - Y', () => {
    const loc = new Rails(23, 56)
    expect(loc.X).toBe(23)
    expect(loc.Y).toBe(56)
  })
})
describe('Direction', () => {
  it('Direction vertical', () => {
    const vertical = new Rails(1, 2, Direction.Vertical)
    expect(vertical.Direction).toBe(1)
  })
  it('Direction horizontal', () => {
    const horizontal = new Rails(1, 2, Direction.Horizontal)
    expect(horizontal.Direction).toBe(2)
  })
  it('Direction left ', () => {
    const east = new Rails(1, 2, Direction.Left)
    expect(east.Direction).toBe(8)
  })
  it('Direction right ', () => {
    const west = new Rails(1, 2, Direction.Right)
    expect(west.Direction).toBe(4)
  })
  it('No direction', () => {
    const empty = new Rails(1, 2)
    expect(empty.Direction).toBe(Direction.None)
  })
})

describe('Position', () => {
  it('x-1 y-1 = 5', () => {
    expect(Position(-1, -1)).toBe(5)
  })
  it('x y -1= 7', () => {
    expect(Position(0, -1)).toBe(7)
  })
  it('x+1 y-1 = 9', () => {
    expect(Position(1, -1)).toBe(9)
  })
  it('x-1 y = 8', () => {
    expect(Position(-1, 0)).toBe(8)
  })
  it('x y = 10', () => {
    expect(Position(0, 0)).toBe(10)
  })
  it('x+1 y = 12', () => {
    expect(Position(1, 0)).toBe(12)
  })
  it('x-1 y+1 = 11', () => {
    expect(Position(-1, 1)).toBe(11)
  })
  it('x y+1 = 13', () => {
    expect(Position(0, 1)).toBe(13)
  })
  it('x+1y+1 = 15', () => {
    expect(Position(1, 1)).toBe(15)
  })
})

describe('Occupied - collision', () => {
  it('Set occupied =  has train ID', () => {
    const occupy = new Rails(1, 2, 1)
    occupy.OccupyBeTrain(5)
    expect(occupy.GetTrain).toBe(5)
    expect(occupy.Collision).toBeFalsy()
  })
  it('Cannot occupy field without rail', () => {
    const occupy = new Rails(1, 2, 0)
    occupy.OccupyBeTrain(5)
    expect(occupy.IsEmpty).toBeTruthy()
    expect(occupy.Collision).toBeFalsy()
  })
  it('Set train id to occupied field = collision', () => {
    const occupy = new Rails(1, 2, 1)
    occupy.OccupyBeTrain(5)
    occupy.OccupyBeTrain(10)
    expect(occupy.Collision).toBeTruthy()
  })
  it('Clear collision = no longer occupied', () => {
    const occupy = new Rails(1, 2, 1)
    occupy.OccupyBeTrain(5)
    occupy.OccupyBeTrain(10)
    occupy.ClearCollision()
    expect(occupy.Collision).toBeFalsy()
    expect(occupy.IsEmpty).toBeTruthy()
  })
})
