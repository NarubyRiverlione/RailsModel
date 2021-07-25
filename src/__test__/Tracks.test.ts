import Direction from '../Model/Direction'
import Tracks from '../Model/Tracks'
import Train from '../Model/Train'
import RailsMock from './mocks/RailsMock'
import SectionMocks from './mocks/SectionsMock'

const makeTestTrack = () => {
  const section1 = new SectionMocks(1)
  section1.Rails.push(new RailsMock(5, 2, Direction.Vertical))
  section1.Rails.push(new RailsMock(6, 2, Direction.Vertical))
  section1.Rails.push(new RailsMock(7, 2, Direction.Vertical))
  const section2 = new SectionMocks(2)
  section2.Rails.push(new RailsMock(5, 12, Direction.Left))
  section2.Rails.push(new RailsMock(6, 13, Direction.Left))
  section2.Rails.push(new RailsMock(7, 14, Direction.Left))
  section2.Rails.push(new RailsMock(8, 15, Direction.Left))
  return { section1, section2 }
}

describe('Make track with sections', () => {
  it('Two section', () => {
    const saveTrack = new Tracks()
    const { section1, section2 } = makeTestTrack()
    saveTrack.Sections.push(section1)
    saveTrack.Sections.push(section2)

    expect(saveTrack.SectionAmount).toBe(2)
    expect(saveTrack.Sections[0].RailAmount).toBe(3)
    expect(saveTrack.Sections[1].RailAmount).toBe(4)
  })
})

describe('Read & Save', () => {
  it('Import test loop track', async () => {
    const testTrack = new Tracks()
    await testTrack.Read('./src/__test__/testLoopTrack.json')
    expect(testTrack.Name).toBe('test track')

    expect(testTrack.SectionAmount).toBe(1)
    const firstSection = testTrack.Sections[0]

    expect(firstSection.RailAmount).toBe(18)
    expect(firstSection.Rails[0].Entrance).toBeTruthy()
    expect(firstSection.Rails[17].Exit).toBeTruthy()
  })

  it('Save track & read it again to verify', async () => {
    const trackName = 'test save'

    const saveTrack = new Tracks()
    saveTrack.Name = trackName
    const { section1, section2 } = makeTestTrack()
    saveTrack.Sections.push(section1)
    saveTrack.Sections.push(section2)

    await saveTrack.Save('.//src/__test__/testSave.json')

    const testTrack = new Tracks()
    await testTrack.Read('./src/__test__/testSave.json')
    expect(testTrack.Name).toBe(trackName)
    expect(testTrack.SectionAmount).toBe(2)
    expect(testTrack.Sections[0].RailAmount).toBe(3)
    expect(testTrack.Sections[1].RailAmount).toBe(4)
  })
})

describe('Trains', () => {
  it('At a train to a track', () => {
    const testTrack = new Tracks()
    const { section1, section2 } = makeTestTrack()
    testTrack.Sections.push(section1)
    testTrack.Sections.push(section2)
    const train1 = new Train('test train', 1, 100, 100)
    train1.SetOnSection(section1, 0)
    testTrack.Trains.push(train1)
    expect(testTrack.Trains.length).toBe(1)
  })
  it('Let a train run', () => {
    const testTrack = new Tracks()
    const { section1, section2 } = makeTestTrack()
    testTrack.Sections.push(section1)
    testTrack.Sections.push(section2)
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
