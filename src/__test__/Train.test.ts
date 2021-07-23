/* eslint-disable max-len */
import Train from '../Model/Train'
import SectionsMock from './mocks/SectionsMock'
import RailsMock from './mocks/RailsMock'
import { CstTrain } from '../Cst'

const FieldsInTestSection = 25
const StartSectionX = 10
const testSection = new SectionsMock(10)
for (let x = StartSectionX; x <= StartSectionX + FieldsInTestSection; x += 1) {
  testSection.Rails.push(new RailsMock(x, 20))
}

describe('Setup new train', () => {
  it('Stopped train and start of section', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const fieldNr = 1
    const train = new Train(name, id, testSection, fieldNr, maxSpeed)
    expect(train.Running).toBeFalsy()
    expect(train.Braking).toBeFalsy()
    expect(train.TraveledDistance).toBe(0)
    expect(train.Id).toBe(id)
    expect(train.MaxSpeed).toBe(maxSpeed)
    expect(train.CurrentSpeed).toBe(0)
    expect(train.OnSection).toMatchObject(testSection)
    expect(testSection.Rails[fieldNr].TrainID).toBe(id)
    expect(train.FieldNr).toBe(fieldNr)
  })
  it('Stopped train and specific part in the section', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const fieldNR = 20
    const train = new Train(name, id, testSection, fieldNR, maxSpeed)
    expect(train.Id).toBe(id)
    expect(train.OnSection).toMatchObject(testSection)
    expect(train.FieldNr).toBe(fieldNR)
    expect(testSection.Rails[fieldNR].TrainID).toBe(id)
  })
})

describe('Train movements', () => {
  it('not moving = stay in current field', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const currentSpeed = 0
    const StartFieldNR = 20
    const train = new Train(name, id, testSection, StartFieldNR, maxSpeed, currentSpeed)
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(id)
    train.Thick()
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(id)
    expect(train.Running).toBeFalsy()
  })
  it('Running at max speed = move to next field when traveled distance = field length, then reset traveled distance', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const currentSpeed = 120
    const StartFieldNR = 20
    const train = new Train(name, id, testSection, StartFieldNR, maxSpeed, currentSpeed)
    train.Running = true
    train.Thick()
    expect(train.TraveledDistance).toBe(maxSpeed)
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(id)
    train.Thick()
    expect(train.TraveledDistance).toBe(maxSpeed * 2)
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(id)
    train.Thick()
    expect(train.TraveledDistance).toBe(maxSpeed * 3)
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(id)
    train.Thick()
    expect(train.TraveledDistance).toBe(maxSpeed * 4)
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(id)

    train.Thick()
    expect(train.TraveledDistance).toBe(0)
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(0)
    expect(testSection.Rails[StartFieldNR + 1].TrainID).toBe(id)

    train.Thick()
    expect(train.TraveledDistance).toBe(maxSpeed)
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(0)
    expect(testSection.Rails[StartFieldNR + 1].TrainID).toBe(id)
  })
  it('No next field in section = stay at current', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const currentSpeed = 60
    const StartFieldNR = FieldsInTestSection
    const train = new Train(name, id, testSection, StartFieldNR, maxSpeed, currentSpeed)
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(id)
    expect(train.FieldNr).toBe(StartFieldNR)
    train.Thick()
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(id)
    expect(train.CurrentSpeed).toBe(0)
  })
})

describe('Speeding, braking', () => {
  it('Running = Increase speed until max', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const startSpeed = 0
    const StartFieldNR = 1
    const train = new Train(name, id, testSection, StartFieldNR, maxSpeed, startSpeed)
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(id)
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
    const train = new Train(name, id, testSection, StartFieldNR, maxSpeed, startSpeed)
    expect(testSection.Rails[StartFieldNR].TrainID).toBe(id)
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
