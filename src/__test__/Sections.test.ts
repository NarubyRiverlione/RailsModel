import Direction, { DirectionByPosition } from '../Model/Direction'
import Sections, { SectionStatus } from '../Model/Sections'
import RailsMock from './mocks/RailsMock'
import { CstError } from '../Cst'
import Places, { PlaceType } from '../Model/Places'

const { SectionError } = CstError

describe('Add rails', () => {
  describe('Empty section', () => {
    it('No fields at start, Status Red', () => {
      const empty = new Sections(123)
      expect(empty.CountRails).toBe(0)
      expect(empty.Id).toBe(123)
      expect(empty.Status).toBe(SectionStatus.Unknown)
    })
    it('Cannot add rail to not-connected section without an entrance', () => {
      const emptySection = new Sections(123)
      try {
        const newRail = new RailsMock(0, 0)
        expect(emptySection.FromSection).toBe(0)
        expect(emptySection.ToSection).toBe(0)
        emptySection.AddRail(newRail)
      } catch (error) {
        expect(error.message).toBe(SectionError.EmptyNoEntrance)
        expect(emptySection.CountRails).toBe(0)
      }
    })
    it('Add rail to section with entrance', () => {
      const emptySection = new Sections(123)
      const newRail = new RailsMock(0, 0)
      newRail.ByPlace = new Places('test entrance', PlaceType.Entrance)
      emptySection.AddRail(newRail)
      expect(emptySection.CountRails).toBe(1)
      expect(emptySection.GetRail(0)).toMatchObject(newRail)
    })
    it('Add rail to connected section', () => {
      const connectedSection = new Sections(123)
      connectedSection.FromSection = 1
      const newRail = new RailsMock(10, 30)
      connectedSection.AddRail(newRail)
      expect(connectedSection.CountRails).toBe(1)
      expect(connectedSection.GetRail(0)).toMatchObject(newRail)
    })
    it('Invalid position = no direction', () => {
      expect(DirectionByPosition(99)).toBe(Direction.None)
    })
  })
  describe('Y - 1 ', () => {
    describe('Position x-1 y-1 = 5', () => {
      let section: Sections
      const entrance = new RailsMock(10, 10)
      const newRail = new RailsMock(9, 9)
      beforeEach(() => {
        section = new Sections(1)
        entrance.ByPlace = new Places('test entrance', PlaceType.Entrance)
        section.AddRail(entrance)
        expect(section.CountRails).toBe(1)
      })
      it('Prev Horizontal', () => {
        section.GetRail(0).Direction = Direction.Horizontal
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Left)
        expect(section.GetRail(0).Direction).toBe(Direction.RightUp)
      })
      it('Prev Vertical', () => {
        section.GetRail(0).Direction = Direction.Vertical
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Left)
        expect(section.GetRail(0).Direction).toBe(Direction.DownLeft)
      })
      it('Prev Left', () => {
        section.GetRail(0).Direction = Direction.Left
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Left)
        expect(section.GetRail(0).Direction).toBe(Direction.Left)
      })
      it('Prev Right', () => {
        section.GetRail(0).Direction = Direction.Right
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Right)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
    })
    describe('Position x y-1 = 7', () => {
      let section: Sections
      const entrance = new RailsMock(10, 10)
      const newRail = new RailsMock(10, 9)
      beforeEach(() => {
        section = new Sections(1)
        entrance.ByPlace = new Places('test entrance', PlaceType.Entrance)
        section.AddRail(entrance)
        expect(section.CountRails).toBe(1)
      })
      it('Prev Horizontal', () => {
        section.GetRail(0).Direction = Direction.Horizontal
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Horizontal)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
      it('Prev Vertical', () => {
        section.GetRail(0).Direction = Direction.Vertical
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Vertical)
        expect(section.GetRail(0).Direction).toBe(Direction.Vertical)
      })
      it('Prev Left', () => {
        section.GetRail(0).Direction = Direction.Left
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Vertical)
        expect(section.GetRail(0).Direction).toBe(Direction.UpRight)
      })
      it('Prev Right', () => {
        section.GetRail(0).Direction = Direction.Right
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Vertical)
        expect(section.GetRail(0).Direction).toBe(Direction.UpLeft)
      })
    })
    describe('Position x+1 y-1 = 9', () => {
      let section: Sections
      const entrance = new RailsMock(10, 10)
      const newRail = new RailsMock(11, 9)
      beforeEach(() => {
        section = new Sections(1)
        entrance.ByPlace = new Places('test entrance', PlaceType.Entrance)
        section.AddRail(entrance)
        expect(section.CountRails).toBe(1)
      })
      it('Prev Horizontal', () => {
        section.GetRail(0).Direction = Direction.Horizontal
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Right)
        expect(section.GetRail(0).Direction).toBe(Direction.LeftUp)
      })
      it('Prev Vertical', () => {
        section.GetRail(0).Direction = Direction.Vertical
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Right)
        expect(section.GetRail(0).Direction).toBe(Direction.DownRight)
      })
      it('Prev Left', () => {
        section.GetRail(0).Direction = Direction.Left
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Left)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
      it('Prev Right', () => {
        section.GetRail(0).Direction = Direction.Right
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Right)
        expect(section.GetRail(0).Direction).toBe(Direction.Right)
      })
    })
  })
  describe('Y', () => {
    describe('Position x-1 y = 8', () => {
      let section: Sections
      const entrance = new RailsMock(10, 10)
      const newRail = new RailsMock(9, 10)
      beforeEach(() => {
        section = new Sections(1)
        entrance.ByPlace = new Places('test entrance', PlaceType.Entrance)
        section.AddRail(entrance)
        expect(section.CountRails).toBe(1)
      })
      it('Prev Horizontal', () => {
        section.GetRail(0).Direction = Direction.Horizontal
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Horizontal)
        expect(section.GetRail(0).Direction).toBe(Direction.Horizontal)
      })
      it('Prev Vertical', () => {
        section.GetRail(0).Direction = Direction.Vertical
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Vertical)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
      it('Prev Left', () => {
        section.GetRail(0).Direction = Direction.Left
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Horizontal)
        expect(section.GetRail(0).Direction).toBe(Direction.LeftDown)
      })
      it('Prev Right', () => {
        section.GetRail(0).Direction = Direction.Right
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Vertical)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
    })
    describe('Position x+1 y = 12', () => {
      let section: Sections
      const entrance = new RailsMock(10, 10)
      const newRail = new RailsMock(11, 10)
      beforeEach(() => {
        section = new Sections(1)
        entrance.ByPlace = new Places('test entrance', PlaceType.Entrance)
        section.AddRail(entrance)
        expect(section.CountRails).toBe(1)
      })
      it('Prev Horizontal', () => {
        section.GetRail(0).Direction = Direction.Horizontal
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Horizontal)
        expect(section.GetRail(0).Direction).toBe(Direction.Horizontal)
      })
      it('Prev Vertical', () => {
        section.GetRail(0).Direction = Direction.Vertical
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Left)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
      it('Prev Left', () => {
        section.GetRail(0).Direction = Direction.Left
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Left)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
      it('Prev Right', () => {
        section.GetRail(0).Direction = Direction.Right
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Horizontal)
        expect(section.GetRail(0).Direction).toBe(Direction.RightDown)
      })
    })
  })
  describe('Y + 1 ', () => {
    describe('Position x-1 y+1 = 11', () => {
      let section: Sections
      const entrance = new RailsMock(10, 10)
      const newRail = new RailsMock(9, 11)
      beforeEach(() => {
        section = new Sections(1)
        entrance.ByPlace = new Places('test entrance', PlaceType.Entrance)
        section.AddRail(entrance)
        expect(section.CountRails).toBe(1)
      })
      it('Prev Horizontal', () => {
        section.GetRail(0).Direction = Direction.Horizontal
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Right)
        expect(section.GetRail(0).Direction).toBe(Direction.RightDown)
      })
      it('Prev Vertical', () => {
        section.GetRail(0).Direction = Direction.Vertical
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Right)
        expect(section.GetRail(0).Direction).toBe(Direction.UpLeft)
      })
      it('Prev Left', () => {
        section.GetRail(0).Direction = Direction.Left
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Right)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
      it('Prev Right', () => {
        section.GetRail(0).Direction = Direction.Right
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Right)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
    })
    describe('Position x y+1 =13', () => {
      let section: Sections
      const entrance = new RailsMock(10, 10)
      const newRail = new RailsMock(10, 11)
      beforeEach(() => {
        section = new Sections(1)
        entrance.ByPlace = new Places('test entrance', PlaceType.Entrance)
        section.AddRail(entrance)
        expect(section.CountRails).toBe(1)
      })
      it('Prev Horizontal', () => {
        section.GetRail(0).Direction = Direction.Horizontal
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Horizontal)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
      it('Prev Vertical', () => {
        section.GetRail(0).Direction = Direction.Vertical
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Vertical)
        expect(section.GetRail(0).Direction).toBe(Direction.Vertical)
      })
      it('Prev Left', () => {
        section.GetRail(0).Direction = Direction.Left
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Vertical)
        expect(section.GetRail(0).Direction).toBe(Direction.DownLeft)
      })
      it('Prev Right', () => {
        section.GetRail(0).Direction = Direction.Right
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Vertical)
        expect(section.GetRail(0).Direction).toBe(Direction.DownRight)
      })
    })
    describe('Position x+1 y+1 = 15', () => {
      let section: Sections
      const entrance = new RailsMock(10, 10)
      const newRail = new RailsMock(11, 11)
      beforeEach(() => {
        section = new Sections(1)
        entrance.ByPlace = new Places('test entrance', PlaceType.Entrance)
        section.AddRail(entrance)
        expect(section.CountRails).toBe(1)
      })
      it('Prev Horizontal', () => {
        section.GetRail(0).Direction = Direction.Horizontal
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Left)
        expect(section.GetRail(0).Direction).toBe(Direction.LeftDown)
      })
      it('Prev Vertical', () => {
        section.GetRail(0).Direction = Direction.Vertical
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Left)
        expect(section.GetRail(0).Direction).toBe(Direction.UpRight)
      })
      it('Prev Left', () => {
        section.GetRail(0).Direction = Direction.Left
        section.AddRail(newRail)
        expect(section.GetRail(1).Direction).toBe(Direction.Left)
        expect(section.GetRail(0).Direction).toBe(Direction.Left)
      })
      it('Prev Right', () => {
        section.GetRail(0).Direction = Direction.Right
        try {
          section.AddRail(newRail)
        } catch (error) {
          expect(section.CountRails).toBe(1)
          expect(section.GetRail(0).Direction).toBe(Direction.Right)
          expect(error.message).toBe(SectionError.NotConnecting)
        }
      })
    })
  })
})
