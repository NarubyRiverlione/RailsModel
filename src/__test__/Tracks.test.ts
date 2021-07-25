import Direction from '../Model/Direction'
import { PlaceType } from '../Model/Places'
import Tracks from '../Model/Tracks'
import Train from '../Model/Train'
import Rails from '../Model/Rails'
import SectionMocks from './mocks/SectionsMock'

const makeTestTrack = () => {
  const section1 = new SectionMocks(1)
  section1.AddRail(new Rails(5, 2, Direction.Vertical))
  section1.AddRail(new Rails(6, 2, Direction.Vertical))
  section1.AddRail(new Rails(7, 2, Direction.Vertical))
  const section2 = new SectionMocks(2)
  section2.AddRail(new Rails(5, 12, Direction.Left))
  section2.AddRail(new Rails(6, 13, Direction.Left))
  section2.AddRail(new Rails(7, 14, Direction.Left))
  section2.AddRail(new Rails(8, 15, Direction.Left))
  return { section1, section2 }
}

describe('Make track with sections', () => {
  it('Two section', () => {
    const saveTrack = new Tracks()
    const { section1, section2 } = makeTestTrack()
    saveTrack.AddSection(section1)
    saveTrack.AddSection(section2)

    expect(saveTrack.SectionAmount).toBe(2)
    expect(saveTrack.sections[0].CountRails).toBe(3)
    expect(saveTrack.sections[1].CountRails).toBe(4)
  })
})

describe('Read & Save', () => {
  it('Import test loop track', async () => {
    const testTrack = new Tracks()
    await testTrack.Read('./src/__test__/testLoopTrack.json')
    expect(testTrack.Name).toBe('test track')

    expect(testTrack.SectionAmount).toBe(1)
    const firstSection = testTrack.sections[0]

    expect(firstSection.CountRails).toBe(18)
    expect(firstSection.GetRail(0).ByPlace.Type).toBe(PlaceType.Entrance)
    expect(firstSection.GetRail(0).Direction).toBe(Direction.Horizontal)
    expect(firstSection.GetRail(10).Direction).toBe(11)
    expect(firstSection.GetRail(17).ByPlace.Type).toBe(PlaceType.Exit)
  })

  it('Save track & read it again to verify', async () => {
    const trackName = 'test save'

    const saveTrack = new Tracks()
    saveTrack.Name = trackName
    const { section1, section2 } = makeTestTrack()
    saveTrack.AddSection(section1)
    saveTrack.AddSection(section2)

    await saveTrack.Save('.//src/__test__/testSave.json')

    const testTrack = new Tracks()
    await testTrack.Read('./src/__test__/testSave.json')
    expect(testTrack.Name).toBe(trackName)
    expect(testTrack.SectionAmount).toBe(2)
    expect(testTrack.sections[0].CountRails).toBe(3)
    expect(testTrack.sections[1].CountRails).toBe(4)
  })
})

describe('Trains', () => {
  it('At a train to a track', () => {
    const testTrack = new Tracks()
    const { section1, section2 } = makeTestTrack()
    testTrack.AddSection(section1)
    testTrack.AddSection(section2)

    const train1 = new Train('test train', 1, 100, 100)
    train1.SetOnSection(section1, 0)
    testTrack.Trains.push(train1)
    expect(testTrack.Trains.length).toBe(1)
  })
  it('Let a train run', () => {
    const testTrack = new Tracks()
    const { section1, section2 } = makeTestTrack()
    testTrack.AddSection(section1)
    testTrack.AddSection(section2)

    const currentSpeed = 100
    const startField = 0
    const train1 = new Train('test train', 1, 100, currentSpeed)
    train1.SetOnSection(section1, startField)
    train1.Running = true
    testTrack.Trains.push(train1)
    testTrack.Thick()
    testTrack.Thick()
    testTrack.Thick()
    testTrack.Thick()
    testTrack.Thick()
    expect(train1.OnFieldNr).toBe(startField + 1)

    testTrack.Thick()
    testTrack.Thick()
    testTrack.Thick()
    testTrack.Thick()
    testTrack.Thick()
    expect(train1.OnFieldNr).toBe(startField + 2)
  })
})
