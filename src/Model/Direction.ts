enum Direction {
  None = 0,
  Vertical = 1,
  Horizontal = 2,
  Right = 4,
  Left = 8,
  DownLeft = 5,
  DownRight = 9,
  UpLeft = 11,
  UpRight = 15,
  LeftUp = 18,
  LeftDown = 30,
  RightUp = 10,
  RightDown = 22,
}

export const ConnectionFromPrevious = (connection: number): Direction => {
  switch (connection) {
    // case 1:
    case 16:
    case 24: return Direction.Horizontal
    // case 2:
    case 7:
    case 13: return Direction.Vertical
    // case 4:
    case 36:
    case 44: return Direction.Right
    // case 8:
    case 40:
    case 120: return Direction.Left
    case 9:
    case 52: return Direction.DownRight
    case 11:
    case 28: return Direction.UpLeft
    case 5:
    case 104: return Direction.DownLeft
    case 15:
    case 56: return Direction.UpRight
    case 10:
    case 96: return Direction.RightUp
    case 18:
    case 32: return Direction.LeftUp
    case 22:
    case 48: return Direction.RightDown
    case 30:
    case 64: return Direction.LeftDown

    case 20:
    case 8:
    case 12:
    case 14:
    case 26:
    case 72: return Direction.None

    default: return Direction.None
  }
}
export const DirectionByPosition = (position: number): Direction => {
  switch (position) {
    case 5:
    case 15: return Direction.Left
    case 7:
    case 13: return Direction.Vertical
    case 9:
    case 11: return Direction.Right
    case 8:
    case 12: return Direction.Horizontal

    default: return Direction.None
  }
}

export const Position = (deltaX: number, deltaY: number) => deltaX * 2 + deltaY * 3 + 10

export default Direction
