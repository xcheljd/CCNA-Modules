// Test utilities
export const mockModules = [
  {
    id: 1,
    day: 1,
    title: 'Network Devices',
    videos: [{ id: 'H8W9oMNSuwo', title: 'Network Devices', duration: '30:25' }],
    resources: {
      lab: 'Day 01 Lab - Packet Tracer Introduction.pkt',
      flashcards: 'Day 01 Flashcards - Network Devices.apkg',
    },
  },
  {
    id: 2,
    day: 2,
    title: 'OSI Model',
    videos: [{ id: 'PLACEHOLDER', title: 'OSI Model', duration: '45:10' }],
    resources: {
      lab: 'Day 02 Lab - OSI Model.pkt',
      flashcards: 'Day 02 Flashcards - OSI Model.apkg',
    },
  },
];

export const createMockModule = (id, day, title) => ({
  id,
  day,
  title,
  videos: [{ id: `video_${id}`, title, duration: '10:00' }],
  resources: {
    lab: `Day ${day} Lab.pkt`,
    flashcards: `Day ${day} Flashcards.apkg`,
  },
});

export const resetLocalStorage = () => {
  localStorage.clear();
};

export const setupProgressState = moduleData => {
  resetLocalStorage();
  moduleData.forEach(module => {
    const videoKey = `video_${module.id}_${module.videos[0].id}`;
    const labKey = `lab_${module.id}`;
    const flashcardKey = `flashcards_${module.id}`;
    const confidenceKey = `confidence_${module.id}`;

    localStorage.setItem(videoKey, 'true');
    localStorage.setItem(labKey, 'true');
    localStorage.setItem(flashcardKey, 'true');
    localStorage.setItem(confidenceKey, '4');
  });
};
