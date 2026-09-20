export interface LogArticle {
  id: string;
  date: string;
  title: string;
  abstract: string;
  content: string;
  thumbnailType?: 'oscilloscope' | 'circuit' | 'code' | 'cad' | 'vision' | 'battery' | 'failed';
  tags?: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  placard: string;
  status: 'finished' | 'in_progress';
  progress?: string;
  summary: string;
  bullets: string[];
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  specifications?: {
    hardware?: string[];
    software?: string[];
    cad?: string[];
    tools?: string[];
  };
  fullDetails?: {
    overview: string;
    schematicNotes?: string[];
    componentsList?: string[];
    firmwareHighlights?: string[];
    challengesSolved?: string;
  };
  logEntries?: LogArticle[];
}

export interface JournalItem {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  summary: string;
  bullets: string[];
  content: string;
  fullDetails?: {
    keyTakeaways: string[];
    codeSnippet?: string;
    conclusion: string;
  };
  logEntries?: LogArticle[];
}

export interface RoadmapMilestone {
  id: string;
  quarter: string;
  title: string;
  status: 'completed' | 'in_progress' | 'planned';
  description: string;
}

export const WORKSHOP_DATA = {
  about: {
    title: "Albert Baiden-Amissah",
    placard: "ABOUT DOSSIER",
    role: "Multidisciplinary Systems Engineer & Builder",
    location: "Tema, Ghana (5.6698° N, 0.0167° W)",
    summary: "Systems builder focused on physical microcontrollers, real-time firmware, CAD assemblies, and responsive interfaces.",
    bullets: [
      "Specializing in ESP32 embedded systems, LoRa RF protocols, and FreeRTOS concurrency.",
      "Bridging the physical-digital gap with tactile hardware nodes and solid 3D CAD modeling.",
      "Believer in continuous iterative prototyping, active documentation, and learning through failure."
    ],
    capabilities: {
      hardware: ["ESP32 / ESP8266 Microcontrollers", "LoRa SX1278 Radio Transceivers", "I2C / SPI / UART Bus Systems", "Sensor Telemetry Integration"],
      software: ["TypeScript / React 18 / Next.js", "C / C++ (FreeRTOS Tasks & Drivers)", "Python (Automation & Data Pipelines)", "RESTful & WebSocket Protocol Endpoints"],
      cad: ["Fusion 360 Solid Modeling", "FDM 3D Printing Prototyping", "Enclosure Slicing & Assembly"]
    }
  },

  mascot: {
    id: "ok-02",
    title: "Mascot OK-02 Showcase",
    placard: "MASCOT OK-02",
    summary: "Autonomous workshop mascot unit equipped with dual optical tracking sensors and real-time cursor angle telemetry.",
    bullets: [
      "Operates on low-power idle patrol and active vector gaze tracking.",
      "Built with real-time math matrix rotation driven by pointer events.",
      "Serves as the workshop's welcoming interface sentinel."
    ]
  },

  finishedProjects: [
    {
      id: "morse-messenger",
      title: "Wireless Morse Code Messenger",
      placard: "MORSE MSG",
      status: "finished" as const,
      summary: "Off-grid text communication transceiver operating independently of cellular or internet networks.",
      bullets: [
        "LoRa SX1278 RF link providing long-range point-to-point text messaging.",
        "Custom Morse interrupt timer parser coded in C++ on ESP32.",
        "Pocket-sized PETG 3D printed enclosure with mechanical key switches."
      ],
      tags: ["ESP32", "C++", "LoRa RF", "CAD Assembly"],
      githubUrl: "https://github.com/Alberick45/wireless-morse-messenger",
      fullDetails: {
        overview: "The Wireless Morse Code Messenger is a self-contained tactical communication node designed for off-grid operations. It pairs an ESP32 microcontroller with a 433MHz LoRa RF module and tactile mechanical key switches to enable sub-gigahertz messaging across extended distance.",
        componentsList: ["ESP32-WROOM-32 MCU", "SX1278 433MHz LoRa Module", "0.96 inch SSD1306 OLED Display", "Cherry MX Mechanical Key Switches", "18650 Li-Ion Cell + TP4056 BMS"],
        schematicNotes: [
          "LoRa SPI Bus: SCK (GPIO 18), MISO (GPIO 19), MOSI (GPIO 23), CS (GPIO 5), RST (GPIO 14), DIO0 (GPIO 26)",
          "OLED I2C Bus: SDA (GPIO 21), SCL (GPIO 22) @ 400kHz speed",
          "Key Interrupts: GPIO 4 hardware debounced interrupt with 15ms hardware RC filter"
        ],
        firmwareHighlights: [
          "FreeRTOS dual-core distribution: Core 0 manages LoRa packet interrupts; Core 1 handles OLED rendering.",
          "Custom Morse encoder converting tactile timing (>250ms hold = dash, <250ms = dot) into ASCII frames."
        ],
        challengesSolved: "Eliminated false key trigger interrupts from mechanical switch contact bounce by implementing a non-blocking millis timer window inside the hardware ISR handler."
      },
      logEntries: [
        {
          id: "morse-log-01",
          date: "May 12, 2025",
          title: "Log #01: RF Range Testing & Packet Loss Analysis",
          abstract: "Probing 433MHz LoRa transmission range across suburban structures. Analyzing RSSI signal drop at 1.8km distance.",
          content: "Field test results confirmed stable packet reception at 1.8 kilometers using a +20dBm transmit power configuration. Heavy concrete walls attenuated signal strength by 14dBm, which was mitigated by enabling explicit preamble detection and adjusting spreading factor SF10.",
          thumbnailType: "oscilloscope",
          tags: ["LoRa RF", "RSSI", "Field Test"]
        },
        {
          id: "morse-log-02",
          date: "May 18, 2025",
          title: "Log #02: Mechanical Switch Debouncing ISR",
          abstract: "Debugging tactile key bounce noise causing double-dash characters. Replacing software delay loops with hardware RC filters.",
          content: "Mechanical switch contacts bounced for up to 8ms after initial press, triggering duplicate ISR interrupts. A 100nF capacitor paired with a 10k resistor provided clean hardware debouncing, supplemented by a 15ms software lockout timer inside the C++ ISR task.",
          thumbnailType: "circuit",
          tags: ["ESP32", "ISR", "Debounce"]
        },
        {
          id: "morse-log-03",
          date: "Jun 02, 2025",
          title: "Log #03: Parametric Enclosure Slicing & Tolerances",
          abstract: "Designing PETG snap-fit housing in Fusion 360. Iterating wall thickness for tactile key switch retention.",
          content: "The 3D printed housing required 0.15mm tolerance offsets around the OLED display bevel to avoid stress whitening the PETG plastic. Heat-set brass M3 inserts were pressed into 4.2mm pilot holes at 230°C nozzle temperature.",
          thumbnailType: "cad",
          tags: ["Fusion 360", "3D Printing", "PETG"]
        }
      ]
    },
    {
      id: "mood-match",
      title: "The Mood Match Engine",
      placard: "MOOD MATCH",
      status: "finished" as const,
      summary: "Sentiment analysis audio queue platform that matches user input text to real-time emotional audio metrics.",
      bullets: [
        "TypeScript & React 18 frontend with sub-second API evaluation.",
        "NLP sentiment classification fallback pipelines.",
        "Interactive Web Audio visualizers and custom matching algorithms."
      ],
      tags: ["React", "TypeScript", "Node.js", "NLP"],
      githubUrl: "https://github.com/Alberick45/the-mood-match",
      fullDetails: {
        overview: "The Mood Match Engine processes incoming text streams, calculates valence and arousal sentiment scores, and dynamically synthesizes audio queues using Web Audio API nodes.",
        componentsList: ["React 18 / Next.js UI layer", "Node.js / Express microservice", "VADER & BERT sentiment classification models", "Web Audio API BiquadFilter & Gain Nodes"],
        schematicNotes: [
          "Frontend client computes audio spectrum analyzer FFT arrays using 64-bin Web Audio AnalyzerNode",
          "WebSockets bi-directional pipeline for zero-latency audio parameter modulation"
        ],
        firmwareHighlights: [
          "Built zero-dependency client fallback classifier for offline sentiment scoring when network latency exceeds 300ms."
        ],
        challengesSolved: "Solved browser audio autoplay restrictions by implementing a unified user gesture unlock listener attached to the main Canvas stage."
      },
      logEntries: [
        {
          id: "mood-log-01",
          date: "Apr 20, 2025",
          title: "Log #01: Web Audio API FFT Spectrum Visualizer",
          abstract: "Configuring 64-bin Web Audio AnalyzerNode to extract real-time frequency data for Canvas spectrum rendering.",
          content: "To achieve smooth 60 FPS audio visualizer animations, frequency data arrays were polled inside a requestAnimationFrame loop using Uint8Array buffers, bypassing React re-render overhead.",
          thumbnailType: "code",
          tags: ["Web Audio", "Canvas", "React"]
        },
        {
          id: "mood-log-02",
          date: "Apr 26, 2025",
          title: "Log #02: Offline NLP Fallback Pipeline",
          abstract: "Implementing zero-latency client-side sentiment evaluation when cloud microservices experience latency spikes.",
          content: "When server response times dipped below 250ms, the engine automatically routes text evaluation to a localized lexicon lookup dictionary, preserving fluid user audio matching.",
          thumbnailType: "code",
          tags: ["TypeScript", "NLP", "Fallback"]
        }
      ]
    },
    {
      id: "lora-mesh-node",
      title: "Off-Grid LoRa Telemetry Node",
      placard: "LORA NODE",
      status: "finished" as const,
      summary: "Solar-powered environmental telemetry node with low-power sleep cycles and long-range RF broadcast.",
      bullets: [
        "BME280 temperature/humidity sensor telemetry over I2C.",
        "Ultra-low power sleep states consuming under 15uA in standby.",
        "Weatherproof 3D printed enclosure with SMA whip antenna mount."
      ],
      tags: ["ESP32", "LoRa", "C++", "Solar"],
      githubUrl: "https://github.com/Alberick45",
      fullDetails: {
        overview: "An autonomous outdoor telemetry station that logs temperature, pressure, and humidity readings every 15 minutes before broadcasting packet telemetry to a central gateway node.",
        componentsList: ["ESP32-PICO-D4", "BME280 Environmental Sensor", "6V 2W Monocrystalline Solar Panel", "CN3065 Solar Charger Board"],
        schematicNotes: [
          "Deep sleep cycle uses ESP32 RTC timer timer wakeup; power rail shut off via AO3401 P-channel MOSFET switch during sleep."
        ],
        firmwareHighlights: [
          "Consumes 12.4 uA in deep sleep mode, enabling indefinite solar-powered operation even during 10 consecutive overcast days."
        ],
        challengesSolved: "Fixed I2C lockup bugs caused by power dipping during low battery states by implementing power-good reset voltage monitor."
      },
      logEntries: [
        {
          id: "lora-log-01",
          date: "Mar 14, 2025",
          title: "Log #01: Solar Charger Current Profiling",
          abstract: "Measuring CN3065 MPPT charging efficiency across varying cloud cover states. Optimizing sleep intervals.",
          content: "Monocrystalline panel output delivered 180mA peak under direct sunlight, replenishing a 2200mAh 18650 Li-Ion cell from 3.4V to 4.15V in 6.5 hours of daylight.",
          thumbnailType: "battery",
          tags: ["Solar", "Power", "Telemetry"]
        }
      ]
    },
    {
      id: "cad-enclosure-v2",
      title: "Modular PCB Enclosure V2",
      placard: "CAD ENCLOSURE",
      status: "finished" as const,
      summary: "Parametric Fusion 360 enclosure featuring snap-fit joints and custom heat-set insert mounting lugs.",
      bullets: [
        "Designed in Fusion 360 with 1:1 tolerance clearance testing.",
        "3D printed in heat-resistant PETG filament with 100% solid lugs.",
        "Houses ESP32 development boards and SSD1306 OLED displays."
      ],
      tags: ["Fusion 360", "3D Printing", "CAD"],
      githubUrl: "https://github.com/Alberick45",
      fullDetails: {
        overview: "A parametric 3D CAD assembly engineered for modular electronic prototypes. Features brass M3 heat-set threaded inserts, ventilation louvers, and a flush-fit acrylic viewport window.",
        componentsList: ["M3 x 4mm x 5mm Brass Heat-Set Inserts", "PETG Filament (0.2mm layer height)", "Clear 2mm Acrylic Laser-Cut Sheet"],
        schematicNotes: [
          "0.15mm clearance offsets for snap-fit latches",
          "Reinforced 3.5mm wall thickness around corner mounting standoffs"
        ],
        firmwareHighlights: [
          "Designed completely in Fusion 360 using parametric User Parameters (`pcb_length`, `pcb_width`, `wall_thick`)."
        ],
        challengesSolved: "Eliminated layer separation under screw torque by changing perimeter line count from 2 to 4 walls and increasing nozzle temperature to 245°C."
      },
      logEntries: [
        {
          id: "cad-log-01",
          date: "Feb 10, 2025",
          title: "Log #01: Parametric Heat-Set Lug Stress Analysis",
          abstract: "Testing tensile pullout force of M3 brass threaded inserts pressed into 3D printed PETG bosses.",
          content: "Heat-set insert retention force exceeded 35kg of pullout force when installed with 1.2mm wall thickness surrounding the boss diameter.",
          thumbnailType: "cad",
          tags: ["CAD", "Fusion 360", "PETG"]
        }
      ]
    }
  ] as ProjectItem[],

  inProgressProjects: [
    {
      id: "edge-ai-vision",
      title: "Edge AI Camera Node",
      placard: "EDGE AI (65%)",
      status: "in_progress" as const,
      progress: "65%",
      summary: "Low-power microcontroller vision node running local TensorFlow Lite model classification at the edge.",
      bullets: [
        "ESP32-CAM module interfaced with local quantized neural network.",
        "Currently optimizing frame buffer DMA transfers to achieve 15 FPS.",
        "Next step: Soldering custom power regulator PCB and thermal heatsink."
      ],
      tags: ["ESP32-CAM", "TensorFlow Lite", "C++"],
      githubUrl: "https://github.com/Alberick45",
      fullDetails: {
        overview: "An edge intelligence visual sensor capable of detecting objects locally without streaming raw video over the network.",
        componentsList: ["ESP32-CAM (OV2640 Sensor)", "2MB PSRAM Chip", "TF-Lite Micro C++ Library", "Custom LM2596 Power Regulator"],
        schematicNotes: [
          "PSRAM operating on SPI Bus at 80MHz",
          "OV2640 DVP parallel camera interface pins 4, 5, 18, 19, 21, 22, 23, 25, 36, 39"
        ],
        firmwareHighlights: [
          "Quantized MobileNet model compressed to 280KB flatbuffer stored in ESP32 flash memory."
        ],
        challengesSolved: "Reduced frame capture stuttering by routing DMA buffers directly into PSRAM memory banks."
      },
      logEntries: [
        {
          id: "edge-log-01",
          date: "Aug 02, 2025",
          title: "Log #01: Frame Buffer DMA Transfer Optimization",
          abstract: "Configuring OV2640 camera parallel DVP interface to pipe frames directly into 2MB PSRAM memory banks.",
          content: "Achieved 14.8 FPS at 320x240 grayscale resolution by enabling dual frame buffer ping-pong DMA transfers in FreeRTOS memory allocation.",
          thumbnailType: "vision",
          tags: ["ESP32-CAM", "DMA", "TF-Lite"]
        }
      ]
    },
    {
      id: "smart-bench-power",
      title: "Bench Programmable Power Supply",
      placard: "BENCH PWR (40%)",
      status: "in_progress" as const,
      progress: "40%",
      summary: "Custom benchtop DC power supply with digital current limiting, OLED metering, and USB-C PD input.",
      bullets: [
        "Adjustable buck-boost converter circuit with active current monitoring.",
        "Currently calibrating ADC voltage readings against precision multimeter.",
        "Next step: Finalizing acrylic front panel cutouts and safety fuse rail."
      ],
      tags: ["Electronics", "Power Systems", "C++"],
      githubUrl: "https://github.com/Alberick45",
      fullDetails: {
        overview: "A dual-channel laboratory bench power supply providing 0-24V at 0-3A with digital constant-current and constant-voltage feedback loops.",
        componentsList: ["TPS5430 Buck Regulator IC", "INA219 High-Side Current Sensor", "STM32F103 MCU / ESP32 Controller", "128x64 OLED Display"],
        schematicNotes: [
          "INA219 I2C current shunt resistor: 0.1 ohm 1% 2W metal foil",
          "PWM driven LC output filter for sub-20mV ripple voltage"
        ],
        firmwareHighlights: [
          "Fast hardware interrupt shutdown trigger when measured current exceeds current limit setpoint."
        ],
        challengesSolved: "Suppressed high frequency switching noise by adding snubber capacitors across primary MOSFET switching nodes."
      },
      logEntries: [
        {
          id: "pwr-log-01",
          date: "Jul 15, 2025",
          title: "Log #01: INA219 Shunt Resistor ADC Calibration",
          abstract: "Calibrating 0.1 ohm metal foil current shunt voltage readings against precision bench multimeter.",
          content: "Mapped non-linear ADC readings near low current ranges (5mA - 50mA) using a 5-point linear regression lookup table stored in Flash EEPROM.",
          thumbnailType: "circuit",
          tags: ["Power", "ADC", "Multimeter"]
        }
      ]
    }
  ] as ProjectItem[],

  failedCrate: {
    id: "failed-crate",
    title: "FAILED PROTOTYPES CRATE",
    placard: "FAILED CRATE",
    summary: "A graveyard of fried regulators, reversed MOSFETs, and sheared 3D prints that built my core engineering foundation.",
    bullets: [
      "Fried ESP8266 Regulator: 12V miswired into 3.3V rail. Taught me to always probe rails before inserting ICs.",
      "Reversed MOSFET Driver: Source and Drain swapped on PCB layout. Taught me to paper-test 1:1 PCB prints before ordering.",
      "Cracked PETG Enclosure: 10% infill split under bolt torque. Taught me to use 100% solid infill on mounting lugs."
    ],
    logEntries: [
      {
        id: "fail-log-01",
        date: "Nov 04, 2024",
        title: "Incident #01: 12V Rail Magic Smoke (Fried ESP8266)",
        abstract: "Swapped 12V raw input line into 3.3V rail during late night breadboard wiring. Instant regulator failure.",
        content: "Root cause: Lack of reverse polarity protection diode and missing keying headers on breadboard power rails. Lesson learned: Always measure rail potential with multimeter before plugging microcontrollers into power.",
        thumbnailType: "failed",
        tags: ["Burn", "Regulator", "Lesson"]
      },
      {
        id: "fail-log-02",
        date: "Jan 19, 2025",
        title: "Incident #02: Reversed MOSFET Source & Drain Footprint",
        abstract: "SOT-23 P-channel MOSFET layout mirrored during KiCad schematic export. Board unusable without wire jumpers.",
        content: "Root cause: KiCad pin numbering mismatch between symbol definition and physical footprint package. Lesson learned: Print 1:1 scale paper mockups to physically check component pin alignments prior to board fab ordering.",
        thumbnailType: "circuit",
        tags: ["KiCad", "PCB", "Footprint"]
      }
    ]
  },

  journal: [
    {
      id: "journal-1",
      title: "My Journey Learning Hardware Basics",
      date: "May 15, 2025",
      readTime: "5 min read",
      category: "Hardware",
      summary: "Exploring microcontrollers, logic gates, and physical hardware circuits during bench sessions.",
      bullets: [
        "Demystifying how software code translates into hardware logic states.",
        "Hands-on experience with oscilloscope probing and signal debouncing.",
        "Why physical feedback loops make engineering deeply satisfying."
      ],
      content: "Working with hands-on hardware circuits helped demystify how software interacts with physical logic gates, microcontrollers, and real-world inputs. Probing pins with oscilloscopes reveals signal bounces that pure software emulators hide.",
      logEntries: [
        {
          id: "j1-log-01",
          date: "May 15, 2025",
          title: "Abstract: Demystifying Low-Level Hardware Gates",
          abstract: "Probing pin states and debouncing hardware switch signals with oscilloscopes during workbench sessions.",
          content: "Working with hands-on hardware circuits helped demystify how software interacts with physical logic gates, microcontrollers, and real-world inputs. Probing pins with oscilloscopes reveals signal bounces that pure software emulators hide.",
          thumbnailType: "oscilloscope",
          tags: ["Hardware", "Oscilloscope", "FreeRTOS"]
        }
      ]
    },
    {
      id: "journal-2",
      title: "Building The Mood Match: Challenges & Solutions",
      date: "Apr 28, 2025",
      readTime: "4 min read",
      category: "Development",
      summary: "Inside look at building sentiment analysis audio matching pipelines in React & Node.",
      bullets: [
        "Overcoming latency bottlenecks during real-time NLP classification.",
        "Designing custom Web Audio API visualizer nodes.",
        "Building reliable fallback logic when third-party microservices fail."
      ],
      content: "The Mood Match concept relies on sentiment analysis and user preferences. Bridging API integrations while maintaining sub-second responses required custom queue management and client-side audio caching.",
      logEntries: [
        {
          id: "j2-log-01",
          date: "Apr 28, 2025",
          title: "Abstract: Sub-Second Audio Pipeline Engineering",
          abstract: "Overcoming latency bottlenecks in React 18 & Web Audio node visualizer graphs.",
          content: "The Mood Match concept relies on sentiment analysis and user preferences. Bridging API integrations while maintaining sub-second responses required custom queue management and client-side audio caching.",
          thumbnailType: "code",
          tags: ["React 18", "Web Audio", "NLP"]
        }
      ]
    },
    {
      id: "journal-3",
      title: "The Intersection of Technology & Reflection",
      date: "Apr 10, 2025",
      readTime: "6 min read",
      category: "Reflection",
      summary: "Reflecting on how intentional tech design fosters quiet focus and meaningful connection.",
      bullets: [
        "Designing distraction-free tactile digital tools.",
        "Balancing rapid prototyping with thoughtful software architecture.",
        "Creating simple interfaces that respect user attention."
      ],
      content: "In a world dominated by rapid notifications, designing spaces for quiet reflection becomes vital. By leveraging clean interface design, we can build tools that encourage deep focus.",
      logEntries: [
        {
          id: "j3-log-01",
          date: "Apr 10, 2025",
          title: "Abstract: Design Principles for Quiet Focus",
          abstract: "Balancing rapid prototyping with intentional software architecture to build distraction-free tools.",
          content: "In a world dominated by rapid notifications, designing spaces for quiet reflection becomes vital. By leveraging clean interface design, we can build tools that encourage deep focus.",
          thumbnailType: "cad",
          tags: ["Design", "Architecture", "Focus"]
        }
      ]
    }
  ] as JournalItem[],

  roadmap: [
    {
      id: "rm-1",
      quarter: "Q1 2026",
      title: "Wireless LoRa Mesh Fleet",
      status: "completed" as const,
      description: "Deploy 3 solar-powered LoRa telemetry nodes across local grid test area."
    },
    {
      id: "rm-2",
      quarter: "Q2 2026",
      title: "Edge Vision AI Firmware",
      status: "in_progress" as const,
      description: "Optimize ESP32-CAM local neural classification model to 15 FPS DMA transfer speed."
    },
    {
      id: "rm-3",
      quarter: "Q3 2026",
      title: "Custom PCB CAD Production",
      status: "planned" as const,
      description: "Draft 2-layer SMD PCB for modular sensor node with integrated USB-C charging."
    }
  ] as RoadmapMilestone[],

  contact: {
    title: "CRT Terminal Control Station",
    placard: "TERMINAL.EXE",
    email: "albertbaidenamissah@proton.me",
    phone: "+233 20 850 6317",
    location: "Tema, Ghana (5.6698° N, 0.0167° W)",
    github: "https://github.com/albertbaiden",
    linkedin: "https://linkedin.com/in/albert-baiden-amissah",
    summary: "Direct comms station. Walk up to send an inquiry or query capability commands via `/help`.",
    bullets: [
      "Email: albertbaidenamissah@proton.me",
      "Phone: +233 20 850 6317",
      "Type `/help` in the terminal to inspect interactive registry commands."
    ]
  }
};
