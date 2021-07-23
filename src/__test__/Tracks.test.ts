import Direction from '../Model/Direction'
import Tracks from '../Model/Tracks'
import RailsMock from './mocks/RailsMock'
import SectionMocks from './mocks/SectionsMock'

describe('Make track with sections', () => {
  it('Two section', () => {
    const section1 = new SectionMocks(1)
    section1.Rails.push(new RailsMock(5, 2, Direction.Vertical))
    section1.Rails.push(new RailsMock(6, 2, Direction.Vertical))
    section1.Rails.push(new RailsMock(7, 2, Direction.Vertical))
    const section2 = new SectionMocks(2)
    section2.Rails.push(new RailsMock(5, 12, Direction.Left))
    section2.Rails.push(new RailsMock(6, 13, Direction.Left))
    section2.Rails.push(new RailsMock(7, 14, Direction.Left))
    section2.Rails.push(new RailsMock(8, 15, Direction.Left))
    const saveTrack = new Tracks()
    saveTrack.Sections.push(section1)
    saveTrack.Sections.push(section2)

    expect(saveTrack.Sections.length).toBe(2)
    expect(saveTrack.Sections[0].Rails.length).toBe(3)
    expect(saveTrack.Sections[1].Rails.length).toBe(4)
  })
})

describe('Read & Save', () => {
  it('Import track', async () => {
    const testTrack = new Tracks()
    await testTrack.Read('./src/__test__/testTrack.json')
    expect(testTrack.Name).toBe('test track')

    expect(testTrack.Sections.length).toBe(1)
    const { Sections } = testTrack
    const { Rails } = Sections[0]
    expect(Rails.length).toBe(11)
    expect(Rails[0].Entrance).toBeTruthy()
    expect(Rails[10].Exit).toBeTruthy()
  })

  it('Save track & read it again to verify', async () => {
    const section1 = new SectionMocks(1)
    section1.Rails.push(new RailsMock(5, 2, Direction.Vertical))
    section1.Rails.push(new RailsMock(6, 2, Direction.Vertical))
    section1.Rails.push(new RailsMock(7, 2, Direction.Vertical))
    const saveTrack = new Tracks()
    const trackName = 'test save'
    saveTrack.Name = trackName
    saveTrack.Sections.push(section1)
    await saveTrack.Save('.//src/__test__/testSave.json')

    const testTrack = new Tracks()
    await testTrack.Read('./src/__test__/testSave.json')
    expect(testTrack.Name).toBe(trackName)
    expect(testTrack.Sections.length).toBe(1)
    expect(testTrack.Sections[0].Rails.length).toBe(3)
  })
})
