/* eslint-disable max-len */
import Train from '../Model/Train'
import SectionsMock from './mocks/SectionsMock'
import Rails from '../Model/Rails'
import { CstTrain, CstError } from '../Cst'
import Places, { PlaceType } from '../Model/Places'

const { TrainError } = CstError
const RailsInTestSection = 25
const StartSectionX = 10
let testSection: SectionsMock

beforeEach(() => {
  testSection = new SectionsMock(10)
  for (let fieldNr = 0; fieldNr < RailsInTestSection; fieldNr += 1) {
    testSection.AddRail(new Rails(StartSectionX + fieldNr, 20, 1))
  }
})

describe('Setup new train', () => {
  it('Make Stopped train and put it on a section', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const fieldNr = 1
    const train = new Train(name, id, maxSpeed)
    expect(train.Running).toBeFalsy()
    expect(train.Braking).toBeFalsy()
    expect(train.TraveledDistance).toBe(0)
    expect(train.Id).toBe(id)
    expect(train.MaxSpeed).toBe(maxSpeed)
    expect(train.CurrentSpeed).toBe(0)
    expect(train.OnSection).toBe(undefined)
    expect(train.OnFieldNr).toBe(-1)
    expect(train.NextStationId).toBe(0)

    train.SetOnSection(testSection, fieldNr)
    expect(train.OnSection).toMatchObject(testSection)
    const onRail = testSection.GetRail(fieldNr)
    expect(onRail.GetTrain).toBe(id)
    expect(train.OnFieldNr).toBe(fieldNr)
  })
  it('Try set a train outside the section', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const testTrain = new Train(name, id, maxSpeed)
    try {
      testTrain.SetOnSection(testSection, RailsInTestSection + 1)
      testTrain.Running = true
    } catch (err) {
      expect(testTrain.OnSection).toBe(undefined)
      expect(testTrain.OnFieldNr).toBe(-1)
      expect(err.message).toBe(`${TrainError.InvalidFieldInSection} ${testTrain.OnFieldNr}/${testSection.CountRails}`)
    }
  })
})

describe('Train movements', () => {
  it('not moving = stay in current field', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const currentSpeed = 0
    const StartFieldNR = 20
    const train = new Train(name, id, maxSpeed, currentSpeed)
    train.SetOnSection(testSection, StartFieldNR)
    expect(testSection.GetRail(StartFieldNR).GetTrain).toBe(id)
    train.Thick()
    expect(testSection.GetRail(StartFieldNR).GetTrain).toBe(id)
    expect(train.Running).toBeFalsy()
  })
  it('Running at max speed = move to next field when traveled distance = field length, then reset traveled distance', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const currentSpeed = 120
    const StartFieldNR = 20
    const train = new Train(name, id, maxSpeed, currentSpeed)
    train.SetOnSection(testSection, StartFieldNR)
    train.Running = true
    train.Thick()
    expect(train.TraveledDistance).toBe(maxSpeed)
    expect(testSection.GetRail(StartFieldNR).GetTrain).toBe(id)
    train.Thick()
    expect(train.TraveledDistance).toBe(maxSpeed * 2)
    expect(testSection.GetRail(StartFieldNR).GetTrain).toBe(id)
    train.Thick()
    expect(train.TraveledDistance).toBe(maxSpeed * 3)
    expect(testSection.GetRail(StartFieldNR).GetTrain).toBe(id)
    train.Thick()
    expect(train.TraveledDistance).toBe(maxSpeed * 4)

    train.Thick()
    expect(train.TraveledDistance).toBe(0)
    expect(testSection.GetRail(StartFieldNR + 1).GetTrain).toBe(id)
    expect(testSection.GetRail(StartFieldNR).IsEmpty).toBeTruthy()

    train.Thick()
    expect(train.TraveledDistance).toBe(maxSpeed)
    expect(testSection.GetRail(StartFieldNR).IsEmpty).toBeTruthy()
    expect(testSection.GetRail(StartFieldNR + 1).GetTrain).toBe(id)
    train.Thick()
    train.Thick()
    train.Thick()
    train.Thick()
    expect(train.TraveledDistance).toBe(0)
    expect(testSection.GetRail(StartFieldNR + 2).GetTrain).toBe(id)
    expect(testSection.GetRail(StartFieldNR + 1).IsEmpty).toBeTruthy()
  })
  it('No next field in section = stay at current', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 250
    const currentSpeed = 250
    const lastField = RailsInTestSection - 1 // count start at zero
    const train = new Train(name, id, maxSpeed, currentSpeed)
    expect(testSection.CountRails).toBe(RailsInTestSection)
    train.SetOnSection(testSection, lastField)
    train.Running = true
    expect(testSection.GetRail(lastField).GetTrain).toBe(id)
    expect(train.OnFieldNr).toBe(lastField)
    // speed 250, length rail = 500 --> need 2 thick to try to move to next  rail
    train.Thick()
    train.Thick()
    expect(train.OnFieldNr).toBe(lastField)
    expect(testSection.GetRail(lastField).GetTrain).toBe(id)
    expect(train.CurrentSpeed).toBe(0)
  })
  it('try moving try without be on a section', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const currentSpeed = 0
    const train = new Train(name, id, maxSpeed, currentSpeed)
    train.Thick()
    expect(train.OnFieldNr).toBe(-1)
  })
  it('Move into next planned station = stop', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 250
    const currentSpeed = 250
    const StartFieldNR = RailsInTestSection - 1
    const nextStationID = 36
    // add station to test section, then add 1 rail passed the station
    const stationX = StartSectionX + RailsInTestSection
    const station = new Rails(stationX, 20, 1)
    station.ByPlace = new Places(nextStationID, 'test station', PlaceType.Station)
    testSection.AddRail(station)

    testSection.AddRail(new Rails(stationX + 1, 20, 1))
    expect(testSection.CountRails).toBe(RailsInTestSection + 2)
    expect(testSection.GetRail(RailsInTestSection).ByPlace.Type).toBe(PlaceType.Station)

    const train = new Train(name, id, maxSpeed, currentSpeed)
    train.SetOnSection(testSection, StartFieldNR)
    train.NextStationId = nextStationID
    train.Running = true

    train.Thick()
    train.Thick()

    expect(train.OnFieldNr).toBe(RailsInTestSection)
    expect(train.Running).toBeFalsy()
  })
  it('Move into next station that is not the next = continue ', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 250
    const currentSpeed = 250
    const StartFieldNR = RailsInTestSection - 1
    const nextStationID = 36
    const nextPlannedStation = 45
    // add station to test section, then add 1 rail passed the station
    const stationX = StartSectionX + RailsInTestSection
    const station = new Rails(stationX, 20, 1)
    station.ByPlace = new Places(nextStationID, 'test station', PlaceType.Station)
    testSection.AddRail(station)

    testSection.AddRail(new Rails(stationX + 1, 20, 1))
    expect(testSection.CountRails).toBe(RailsInTestSection + 2)
    expect(testSection.GetRail(RailsInTestSection).ByPlace.Type).toBe(PlaceType.Station)

    const train = new Train(name, id, maxSpeed, currentSpeed)
    train.SetOnSection(testSection, StartFieldNR)
    train.NextStationId = nextPlannedStation
    train.Running = true

    train.Thick()
    train.Thick()

    expect(train.OnFieldNr).toBe(RailsInTestSection)
    expect(testSection.GetRail(train.OnFieldNr).NextToStationId).not.toBe(nextPlannedStation)
    expect(train.Running).toBeTruthy()
  })
})

describe('Speeding, braking', () => {
  it('Running = Increase speed until max', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const startSpeed = 0
    const StartFieldNR = 1
    const train = new Train(name, id, maxSpeed, startSpeed)
    train.SetOnSection(testSection, StartFieldNR)
    expect(testSection.GetRail(StartFieldNR).GetTrain).toBe(id)
    const { SpeedingUp } = CstTrain
    train.Running = true
    train.Thick()
    expect(train.CurrentSpeed).toBe(startSpeed + SpeedingUp)
    train.Thick()
    expect(train.CurrentSpeed).toBe(startSpeed + SpeedingUp * 2)
    train.Thick()
    expect(train.CurrentSpeed).toBe(startSpeed + SpeedingUp * 3)
    train.Thick()
    expect(train.CurrentSpeed).toBe(startSpeed + SpeedingUp * 4)
    train.Thick()
    expect(train.CurrentSpeed).toBe(startSpeed + SpeedingUp * 5)
    train.Thick()
    expect(train.CurrentSpeed).toBe(maxSpeed)
    train.Thick()
    expect(train.CurrentSpeed).toBe(maxSpeed)
  })
  it('Braking = decrease speed until 0', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const startSpeed = 90
    const StartFieldNR = 1
    const train = new Train(name, id, maxSpeed, startSpeed)
    train.SetOnSection(testSection, StartFieldNR)
    expect(testSection.GetRail(StartFieldNR).GetTrain).toBe(id)
    const { Braking } = CstTrain
    train.Braking = true
    train.Thick()
    expect(train.CurrentSpeed).toBe(startSpeed - Braking)
    train.Thick()
    expect(train.CurrentSpeed).toBe(startSpeed - Braking * 2)
    train.Thick()
    expect(train.CurrentSpeed).toBe(startSpeed - Braking * 3)
    train.Thick()
    expect(train.CurrentSpeed).toBe(startSpeed - Braking * 4)
    train.Thick()
    expect(train.CurrentSpeed).toBe(startSpeed - Braking * 5)
    train.Thick()
    expect(train.CurrentSpeed).toBe(0)
    expect(train.Braking).toBeFalsy()
    train.Thick()
    expect(train.CurrentSpeed).toBe(0)
    expect(train.Braking).toBeFalsy()
  })
})
