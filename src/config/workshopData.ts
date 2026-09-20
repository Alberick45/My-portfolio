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
    role: "Multidisciplinary Systems Engineer & Builder (A3PK Labs)",
    location: "Tema, Ghana (5.6698° N, 0.0167° W)",
    summary: "Systems builder focused on physical microcontrollers, real-time firmware, CAD assemblies, and responsive interfaces. Build. Break. Learn. Repeat.",
    bullets: [
      "Specializing in ESP32 embedded systems, LoRa RF protocols, and FreeRTOS concurrency.",
      "Bridging the physical-digital gap with tactile hardware nodes and solid 3D CAD modeling in Fusion 360.",
      "Believer in continuous iterative prototyping, active documentation, and learning through failure states."
    ],
    capabilities: {
      hardware: ["ESP32 / ESP8266 Microcontrollers", "LoRa SX1278 Radio Transceivers", "SSD1306 OLED & I2C Bus Systems", "Sensor Telemetry Integration"],
      software: ["TypeScript / React 18 / Next.js", "C / C++ (FreeRTOS Tasks & Drivers)", "Python (Automation & Data Pipelines)", "RESTful & Web Audio Protocol Endpoints"],
      cad: ["Fusion 360 Solid Modeling", "FDM 3D Printing Prototyping (PETG)", "Enclosure Slicing & Brass Heat-Set Assemblies"]
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
    ],
    logEntries: [
      {
        id: "mascot-log-01",
        date: "Sep 18, 2026",
        title: "Log #01: Real-Time Vector Gaze Calibration",
        abstract: "Calibrating pupil movement bounds and smooth linear interpolation easing for viewport cursor tracking.",
        content: "Mascot OK-02 parses window mouse events into normalized coordinates (dx, dy). Linear easing keeps eye pupil translation smooth without frame stutter, accompanied by a 3.2-second scaleY blinking loop.",
        thumbnailType: "vision",
        tags: ["Vector Math", "Gaze Tracking", "Mascot"]
      }
    ]
  },

  finishedProjects: [
    {
      id: "morse-messenger",
      title: "Wireless Morse Code Messenger",
      placard: "MORSE MSG (v1.4)",
      status: "finished" as const,
      summary: "Completely off-grid text communication transceiver operating independently of cellular networks or internet infrastructure.",
      bullets: [
        "LoRa SX1278 RF link providing long-range point-to-point text messaging.",
        "Custom Morse interrupt timer parser coded in C++ on ESP32 with 40ms software debounce.",
        "Pocket-sized PETG 3D printed enclosure with Cherry MX mechanical key switches and SMA whip antenna mount."
      ],
      tags: ["ESP32", "C++", "LoRa RF", "CAD Assembly", "Morse Protocol"],
      githubUrl: "https://github.com/Alberick45/wireless-morse-messenger",
      fullDetails: {
        overview: "The Wireless Morse Code Messenger is a self-contained tactical communication node designed for off-grid operations. It pairs an ESP32 microcontroller with a 433MHz LoRa RF module, an SSD1306 OLED display, and tactile Cherry MX mechanical switches to enable sub-gigahertz text messaging across extended distances.",
        componentsList: ["ESP32-WROOM-32E MCU", "LoRa SX1278 433MHz Transceiver", "SSD1306 0.96 inch OLED Screen", "Cherry MX Mechanical Key Switches", "SMA Whip Antenna + M3 Brass Inserts"],
        schematicNotes: [
          "LoRa SPI Bus: SCK (GPIO 18), MISO (GPIO 19), MOSI (GPIO 23), CS (GPIO 5), RST (GPIO 14), DIO0 (GPIO 26)",
          "OLED I2C Bus: SDA (GPIO 21), SCL (GPIO 22) @ 400kHz speed",
          "Key Interrupts: GPIO 4 hardware debounced interrupt with 15ms RC filter"
        ],
        firmwareHighlights: [
          "FreeRTOS dual-core distribution: Core 0 manages LoRa packet interrupts; Core 1 handles OLED rendering.",
          "Custom Morse encoder converting tactile timing (>250ms hold = dash, <250ms = dot) into ASCII text frames."
        ],
        challengesSolved: "Eliminated false key trigger interrupts from mechanical switch contact bounce by implementing a non-blocking millis timer window inside the hardware ISR handler, boosting RF range to 1.8km with dedicated SMA antenna mounting."
      },
      logEntries: [
        {
          id: "morse-log-01",
          date: "Oct 15, 2025",
          title: "Log #01: Concept Formulated & Off-Grid Architecture",
          abstract: "Brainstorming off-grid communication using low-frequency radio modules and manual Morse keypads.",
          content: "Conceptualized a portable sub-gigahertz transceiver for emergency off-grid communication. Selected 433MHz LoRa modules for superior penetration through foliage and structural obstacles compared to 2.4GHz WiFi/Bluetooth.",
          thumbnailType: "oscilloscope",
          tags: ["LoRa RF", "Architecture", "Concept"]
        },
        {
          id: "morse-log-02",
          date: "Nov 14, 2025",
          title: "Log #02: SMA Antenna Mount Boosts Range to 1.8km",
          abstract: "Solder-modifying dedicated SMA whip antenna mount after initial trace impedance losses caused high packet drops.",
          content: "Discovered severe packet drops at 500 meters during initial breadboard testing. Solder-modifying an external SMA connector with an 8dBi whip antenna reduced RSSI attenuation and extended stable line-of-sight range to 1.8 kilometers.",
          thumbnailType: "circuit",
          tags: ["RF Antenna", "SMA", "1.8km Test"]
        },
        {
          id: "morse-log-03",
          date: "Dec 05, 2025",
          title: "Log #03: Custom Morse Interrupt Parser & OLED History",
          abstract: "Coding real-time interrupt timer engine in C++ to translate tactile switch hold durations into ASCII frames.",
          content: "Built a non-blocking hardware interrupt parser on ESP32. Switch presses under 250ms register as dots (.), presses over 250ms register as dashes (-), with word spaces auto-inserted after 1.2s of idle time.",
          thumbnailType: "code",
          tags: ["C++", "FreeRTOS", "OLED Engine"]
        }
      ]
    },
    {
      id: "mood-match",
      title: "The Mood Match Engine",
      placard: "MOOD MATCH (v2.1)",
      status: "finished" as const,
      summary: "Sentiment analysis audio queue platform that matches user input text to real-time emotional audio metrics.",
      bullets: [
        "TypeScript & React 18 frontend with sub-second API evaluation.",
        "HuggingFace NLP sentiment classification fallback pipelines.",
        "Interactive Web Audio visualizers and custom matching algorithms."
      ],
      tags: ["React", "TypeScript", "Node.js", "NLP Sentiment", "Web Audio API"],
      githubUrl: "https://github.com/Alberick45/the-mood-match",
      fullDetails: {
        overview: "The Mood Match Engine overcomes the limitations of static genre-based playlists by analyzing input user text for real-time emotional metrics (valence and arousal) and dynamically generating matching audio queues.",
        componentsList: ["React 18 / Next.js UI Layer", "Express.js Node API Microservice", "HuggingFace Sentiment Transformers", "Web Audio API Spectrum Analyzer"],
        schematicNotes: [
          "Frontend client computes audio spectrum analyzer FFT arrays using 64-bin Web Audio AnalyzerNode",
          "WebSockets bi-directional pipeline for zero-latency audio parameter modulation"
        ],
        firmwareHighlights: [
          "Built zero-dependency client fallback classifier for offline sentiment scoring when network latency exceeds 300ms."
        ],
        challengesSolved: "Solved browser audio autoplay restrictions by implementing a unified user gesture unlock listener attached to the main Canvas stage, and implemented Redis caching for extracted sentence profiles."
      },
      logEntries: [
        {
          id: "mood-log-01",
          date: "May 12, 2025",
          title: "Log #01: Valence & Arousal Sentiment Extraction",
          abstract: "Parsing diary text logs to extract emotional valence and energy telemetry for song selection.",
          content: "Designed a multi-dimensional scoring model mapping text valence (positive/negative) and arousal (calm/energetic) directly to Spotify audio features. Ensured sub-second matching response.",
          thumbnailType: "code",
          tags: ["NLP", "TypeScript", "Audio Metrics"]
        },
        {
          id: "mood-log-02",
          date: "Jun 15, 2025",
          title: "Log #02: Redis Caching & LLM Fallback Pipeline",
          abstract: "Implementing Redis caching for sentence profiles to prevent rate limits during parallel text evaluation.",
          content: "Single-word inputs initially returned erratic sentiment scores due to lack of surrounding context. Added an LLM-assisted fallback prompt to expand sparse inputs into descriptive paragraphs before evaluation.",
          thumbnailType: "circuit",
          tags: ["Redis", "LLM Fallback", "Caching"]
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
      tags: ["ESP32", "LoRa", "C++", "Solar Telemetry"],
      githubUrl: "https://github.com/Alberick45",
      fullDetails: {
        overview: "An autonomous outdoor telemetry station that logs temperature, pressure, and humidity readings every 15 minutes before broadcasting packet telemetry to a central gateway node.",
        componentsList: ["ESP32-PICO-D4", "BME280 Environmental Sensor", "6V 2W Monocrystalline Solar Panel", "CN3065 Solar Charger Board"],
        schematicNotes: [
          "Deep sleep cycle uses ESP32 RTC timer wakeup; power rail shut off via AO3401 P-channel MOSFET switch during sleep."
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
          title: "Log #01: Solar Charger Current Profiling & Deep Sleep",
          abstract: "Measuring CN3065 MPPT charging efficiency across varying cloud cover states. Optimizing sleep intervals.",
          content: "Monocrystalline panel output delivered 180mA peak under direct sunlight, replenishing a 2200mAh 18650 Li-Ion cell from 3.4V to 4.15V in 6.5 hours of daylight while deep sleep draws only 12.4uA.",
          thumbnailType: "battery",
          tags: ["Solar", "15uA Sleep", "Telemetry"]
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
      tags: ["Fusion 360", "3D Printing", "PETG CAD"],
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
          tags: ["Fusion 360", "PETG", "Heat-Set Inserts"]
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
    summary: "A physical crate containing fried LDO regulators, reversed MOSFET footprints, and sheared PETG prints that built my core engineering foundation.",
    bullets: [
      "Fried ESP8266 LDO Regulator: 12V raw line miswired into 3.3V logic. Taught me to always probe power rails with multimeter before inserting ICs.",
      "Reversed MOSFET Driver: Source and Drain swapped on KiCad PCB layout. Taught me to paper-test 1:1 PCB prints before ordering board runs.",
      "Cracked PETG Enclosure: 10% grid infill split under bolt torque. Taught me to use 100% solid infill on structural screw mounting standoffs."
    ],
    logEntries: [
      {
        id: "fail-log-01",
        date: "Nov 04, 2024",
        title: "Incident #01: Fried ESP8266 LDO Regulator (Overvoltage)",
        abstract: "Fed 12V directly into 3.3V logic line during a late-night bench session. Magic smoke escaped instantly.",
        content: "Root Cause: Lack of reverse polarity protection diode and missing keying headers on breadboard power rails. Lesson learned: Always measure rail potential with multimeter probes before inserting microcontrollers into breadboards.",
        thumbnailType: "failed",
        tags: ["Burn", "12V Overvoltage", "Multimeter Lesson"]
      },
      {
        id: "fail-log-02",
        date: "Jan 19, 2025",
        title: "Incident #02: Reversed MOSFET Source & Drain Pins",
        abstract: "Swapped Source and Drain pins on N-Channel MOSFET driver board. Motor stayed latched ON continuously.",
        content: "Root Cause: KiCad pin numbering mismatch between symbol definition and physical footprint package. Lesson learned: Print PCB layouts at 1:1 scale on paper and test component pinouts before ordering board runs.",
        thumbnailType: "circuit",
        tags: ["KiCad Error", "MOSFET", "Paper Test"]
      },
      {
        id: "fail-log-03",
        date: "Mar 08, 2025",
        title: "Incident #03: Cracked PETG Weatherproof Housing",
        abstract: "Used 10% grid infill for an outdoor weather-proof housing; walls sheared under M3 bolt torque pressure.",
        content: "Root Cause: Inadequate perimeter wall count and weak infill density behind threaded screw standoffs. Lesson learned: Load-bearing mechanical mounting lugs require 4+ perimeters and 100% solid infill regions.",
        thumbnailType: "cad",
        tags: ["PETG Shear", "Fusion 360", "Infill Lesson"]
      }
    ]
  },

  journal: [
    {
      id: "journal-spelling-bee",
      title: "The Robot I Saw at a Spelling Bee",
      date: "September 18, 2026",
      readTime: "5 min read",
      category: "Life & Tech",
      summary: "In 2018 at a JHS spelling bee at DPS, an old friend showed me a robot he'd built — and nothing about my plans looked the same after that.",
      bullets: [
        "How a chance meeting with Chris at DPS opened my eyes to student robotics.",
        "The shift from consuming tech to understanding I could build physical hardware.",
        "The origin story of A3PK Labs and my journey into microcontrollers."
      ],
      content: "I didn't go to DPS looking for robots. I went for a spelling bee. That's the part I always have to remind myself of when I tell this story — none of it was planned. It was just a normal inter-school competition... While I was there, I ran into an old friend — Chris, someone who used to be at my school before he moved to DPS. We got talking, and almost as a side note, he showed me something he'd been building. I was looking at an actual robot — something a student, someone my age, had built with his own hands. I was smitten. Looking back now, this is where it all starts — not with a class, but with a spelling bee and Chris building something incredible on the side.",
      logEntries: [
        {
          id: "spelling-bee-log-01",
          date: "September 18, 2026",
          title: "Abstract: 2018 JHS Spelling Bee & Chris's Robot",
          abstract: "Running into Chris at DPS, seeing a student-built physical robot for the first time, and discovering A3PK Labs' foundation.",
          content: "I didn't go to DPS looking for robots. I went for a spelling bee. While there, my friend Chris showed me an actual robot he built. My own school didn't have anything like this — no robotics setup, no lab full of wires and motors. It opened a door I didn't know existed, leading directly to A3PK Labs.",
          thumbnailType: "vision",
          tags: ["Origin Story", "2018 JHS", "A3PK Labs", "Robotics"]
        }
      ]
    },
    {
      id: "journal-portfolio-redesign",
      title: "Rebuilding Albert.dev: From Portfolio Template to Engineering Workshop",
      date: "July 25, 2026",
      readTime: "6 min read",
      category: "Development",
      summary: "A build log on why I tore down my portfolio and rebuilt it as a lab, not a resume.",
      bullets: [
        "Tearing down generic percentage bars and standard portfolio template cards.",
        "Reframing the website as an active workshop with Build. Break. Learn. Repeat.",
        "Building DEV_CONSOLE.bin terminal easter egg and Repository Index."
      ],
      content: "For a while, my portfolio did what most student portfolios do: it introduced me, listed some skills as percentage bars, and showed a grid of project cards. It worked. It just didn't sound like me... The fix wasn't just a new color palette. It was a change in framing. Instead of presenting myself as a finished product, I wanted the site to read like an active lab — a place documenting real builds, real iterations, and real failures, in progress. That's where the terminal/dev-console identity came from: Build. Break. Learn. Repeat. — the same line I use for A3PK Labs.",
      logEntries: [
        {
          id: "redesign-log-01",
          date: "July 25, 2026",
          title: "Abstract: Rebuilding Albert.dev as an Active Workshop Lab",
          abstract: "Tearing down percentage bars and placeholder cards to build a living engineering repository and DEV_CONSOLE.bin.",
          content: "The percentage bars and placeholder cards were impersonal. Anyone could have that portfolio. The rebuild makes the site sound like it was built by someone who documents failure states and half-finished prototypes on purpose, because that's the actual process — not just the polished outcome.",
          thumbnailType: "code",
          tags: ["Portfolio Redesign", "A3PK Labs", "Build Log", "Terminal"]
        }
      ]
    },
    {
      id: "journal-hackathon",
      title: "IEEE x GDG x Aaenics Hackathon Highlights & Pitching Takeaways",
      date: "July 26, 2026",
      readTime: "3 min read",
      category: "Development",
      summary: "Attended a combined IEEE, GDG, and Aaenics hackathon at Longjii Hotel. Observations on a winning idea, key takeaways on problem-first pitch strategies.",
      bullets: [
        "Attending combined hackathon at Longjii Hotel with student developers.",
        "Winning pitch by Aaenics members and judges' feedback.",
        "Core engineering takeaway: Problem-First Framing when presenting technical ideas."
      ],
      content: "Attended a combined hackathon hosted by IEEE, GDG, and Aaenics at Longjii Hotel. A team consisting mostly of Aaenics members took first place with a brilliant, highly polished concept... Core Engineering Takeaway for Pitching: Problem-First Framing. When presenting an idea, the priority is to clearly illuminate the problem so the audience grasps its true weight. Follow it up with a practical, cost-effective solution your team can execute.",
      logEntries: [
        {
          id: "hackathon-log-01",
          date: "July 26, 2026",
          title: "Abstract: Longjii Hotel Hackathon & Problem-First Pitching",
          abstract: "Key takeaways on problem-first pitch strategies, value propositions, and Aaenics team winning concept.",
          content: "When presenting an idea, the priority is to clearly illuminate the problem so the audience grasps its true weight. Follow it up with a practical, cost-effective solution your team can execute. Mastering this balance makes any pitch compelling.",
          thumbnailType: "circuit",
          tags: ["Hackathon", "Pitching Strategy", "IEEE x GDG", "Aaenics"]
        }
      ]
    },
    {
      id: "journal-hardware-basics",
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
      content: "During my internship, I had the incredible opportunity to dive into the fundamentals of electronics and microcontrollers. Working with hands-on hardware circuits helped demystify how software interacts with physical logic gates, microcontrollers, and real-world inputs. Probing pins with oscilloscopes reveals signal bounces that pure software emulators hide.",
      logEntries: [
        {
          id: "hw-basics-log-01",
          date: "May 15, 2025",
          title: "Abstract: Demystifying Low-Level Hardware Gates",
          abstract: "Probing pin states and debouncing hardware switch signals with oscilloscopes during workbench sessions.",
          content: "Working with hands-on hardware circuits helped demystify how software interacts with physical logic gates, microcontrollers, and real-world inputs. Probing pins with oscilloscopes reveals signal bounces that pure software emulators hide.",
          thumbnailType: "oscilloscope",
          tags: ["Hardware", "Oscilloscope", "Microcontrollers"]
        }
      ]
    },
    {
      id: "journal-mood-match",
      title: "Building The Mood Match: Challenges and Solutions",
      date: "April 28, 2025",
      readTime: "4 min read",
      category: "Development",
      summary: "An inside look at the development process of my mood-matching platform, sentiment analysis, and Web Audio API integrations.",
      bullets: [
        "Designing customized matching algorithms to map user sentiment to song valence & energy.",
        "Ensuring sub-second response times across cloud NLP endpoints.",
        "Solving browser audio autoplay restrictions using unified gesture unlock listeners."
      ],
      content: "The Mood Match concept relies on sentiment analysis and user preferences. Bridging the API integrations, ensuring sub-second response times, and selecting accurate recommendation paths was both challenging and rewarding. I designed a customized matching algorithm to make music suggestions feel highly responsive and natural.",
      logEntries: [
        {
          id: "mood-match-log-01",
          date: "April 28, 2025",
          title: "Abstract: Sentiment NLP Engine & Web Audio API Integrations",
          abstract: "An inside look at the development process of my mood-matching platform and how I solved audio autoplay and API latency limits.",
          content: "The Mood Match concept relies on sentiment analysis and user preferences. Bridging the API integrations, ensuring sub-second response times, and selecting accurate recommendation paths was both challenging and rewarding. I designed a customized matching algorithm to make music suggestions feel highly responsive and natural.",
          thumbnailType: "code",
          tags: ["NLP", "Web Audio", "Development", "TypeScript"]
        }
      ]
    },
    {
      id: "journal-spirituality",
      title: "The Intersection of Technology and Spirituality",
      date: "April 10, 2025",
      readTime: "6 min read",
      category: "Reflection",
      summary: "Reflecting on how clean UI design and calm digital tools can foster meaningful reflection in a fast-paced digital age.",
      bullets: [
        "Creating distraction-free digital environments for deep meditation and quiet reflection.",
        "Leveraging minimal interface design to reduce cognitive overload.",
        "Designing software that serves quiet contemplation rather than rapid retention loops."
      ],
      content: "In a world dominated by rapid notifications and short attention spans, designing spaces for quiet reflection and spiritual community becomes vital. By leveraging clean, simple interface design, we can build online spaces that encourage meditation, prayer, and deep connection.",
      logEntries: [
        {
          id: "spirituality-log-01",
          date: "April 10, 2025",
          title: "Abstract: Calm Technology & Minimalist Interface Design",
          abstract: "Reflecting on how technology can enhance spiritual experiences and foster meaningful connections in our digital age.",
          content: "In a world dominated by rapid notifications and short attention spans, designing spaces for quiet reflection and spiritual community becomes vital. By leveraging clean, simple interface design, we can build online spaces that encourage meditation, prayer, and deep connection.",
          thumbnailType: "vision",
          tags: ["Calm Tech", "Reflection", "UI Design", "Spirituality"]
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
