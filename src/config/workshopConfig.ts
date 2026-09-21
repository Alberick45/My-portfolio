export const ROOM_CONFIG = {
  W: 900,         // Room width in px
  H: 600,         // Room height in px
  D: 3800,        // Room depth in px
  L: 4300,        // Plane length (D + 500)
  CZ: -1650,      // Plane center Z ((500 - D) / 2)
  perspective: 700,
  maxCameraZ: 3600,
  easing: 0.06,
};

export interface StationConfig {
  id: string;
  z: number;
  label: string;
  placard: string;
}

export const WORKSHOP_STATIONS: StationConfig[] = [
  { id: 'doorway', z: 0, label: 'Doorway Entrance', placard: 'ENTRANCE' },
  { id: 'showcase', z: -700, label: 'Showcase of Firsts', placard: 'MASCOT & ABOUT' },
  { id: 'finished', z: -1500, label: 'Finished Work', placard: 'FINISHED PROJECTS' },
  { id: 'workstation', z: -2350, label: 'The Workstation', placard: 'IN PROGRESS' },
  { id: 'logbook', z: -3000, label: 'Logbook & Plans', placard: 'ROADMAP & JOURNAL' },
  { id: 'terminal', z: -3600, label: 'The Terminal', placard: 'CONTACT /HELP' },
];
