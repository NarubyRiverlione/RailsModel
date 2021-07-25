/* eslint-disable max-len */
import Train from '../Model/Train'
import SectionsMock from './mocks/SectionsMock'
import RailsMock from './mocks/RailsMock'
import { CstTrain, CstError } from '../Cst'

const { TrainError } = CstError
const FieldsInTestSection = 25
const StartSectionX = 10
const testSection = new SectionsMock(10)
for (let fieldNr = 0; fieldNr < FieldsInTestSection; fieldNr += 1) {
  testSection.Rails.push(new RailsMock(StartSectionX + fieldNr, 20))
}

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

    train.SetOnSection(testSection, fieldNr)
    expect(train.OnSection).toMatchObject(testSection)
    expect(testSection.Rails[fieldNr].TrainID).toBe(id)
    expect(train.OnFieldNr).toBe(fieldNr)
  })
  it('Try set a train outside the section', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const testTrain = new Train(name, id, maxSpeed)
    try {
      testTrain.SetOnSection(testSection, FieldsInTestSection + 1)
      testTrain.Running = true
    } catch (err) {
      expect(testTrain.OnSection).toBe(undefined)
      expect(testTrain.OnFieldNr).toBe(-1)
      expect(err.message).toBe(`${TrainError.InvalidFieldInSection} ${testTrain.OnFieldNr}/${testSection.Rails.length}`)
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
    const train = new Train(name, id, maxSpeed, currentSpeed)
    train.SetOnSection(testSection, StartFieldNR)
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
    train.Thick()
    train.Thick()
    train.Thick()
    train.Thick()
    expect(train.TraveledDistance).toBe(0)
    expect(testSection.Rails[StartFieldNR + 2].TrainID).toBe(id)
    expect(testSection.Rails[StartFieldNR + 1].TrainID).toBe(0)
  })
  it('No next field in section = stay at current', () => {
    const name = 'Test Train'
    const id = 1
    const maxSpeed = 120
    const currentSpeed = 60
    const lastField = FieldsInTestSection - 1 // count start at zero
    const train = new Train(name, id, maxSpeed, currentSpeed)
    expect(testSection.Rails.length).toBe(FieldsInTestSection)
    train.SetOnSection(testSection, lastField)
    expect(testSection.Rails[lastField].TrainID).toBe(id)
    expect(train.OnFieldNr).toBe(lastField)
    train.Thick()
    expect(testSection.Rails[lastField].TrainID).toBe(id)
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
    const train = new Train(name, id, maxSpeed, startSpeed)
    train.SetOnSection(testSection, StartFieldNR)
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
