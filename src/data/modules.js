// CCNA 200-301 Course Modules Data
// Based on Jeremy's IT Lab course structure

export const modules = [
  {
    id: 1,
    day: 1,
    title: 'Network Devices',
    videos: [
      { id: 'H8W9oMNSuwo', title: 'Network Devices', duration: '17:06' },
      { id: '6Atw8oMtVTA', title: 'Extra - Using Anki Flashcards', duration: '06:11' },
      { id: 'a1Im6GYaSno', title: 'Lab - Packet Tracer Introduction', duration: '08:43' },
    ],
    resources: {
      lab: 'Day 01 Lab - Packet Tracer Introduction.pkt',
      flashcards: 'Day 01 Flashcards - Network Devices.apkg',
    },
  },
  {
    id: 2,
    day: 2,
    title: 'Interfaces and Cables',
    videos: [
      { id: 'ieTH5lVhNaY', title: 'Interfaces and Cables', duration: '22:35' },
      { id: 'K6Qt23sY68Y', title: 'Lab - Connecting Devices', duration: '10:24' },
    ],
    resources: {
      lab: 'Day 02 Lab - Connecting Devices.pkt',
      flashcards: 'Day 02 Flashcards - Interfaces and Cables.apkg',
    },
  },
  {
    id: 3,
    day: 3,
    title: 'OSI Model & TCP/IP Suite',
    videos: [
      { id: 't-ai8JzhHuY', title: 'OSI Model & TCP/IP Suite', duration: '26:42' },
      { id: '7nmYoL0t2tU', title: 'Lab - OSI Model', duration: '08:18' },
    ],
    resources: {
      lab: 'Day 03 Lab - OSI Model.pkt',
      flashcards: 'Day 03 Flashcards - OSI Model, TCP-IP Suite.apkg',
    },
  },
  {
    id: 4,
    day: 4,
    title: 'Introduction to the CLI',
    videos: [
      { id: 'IYbtai7Nu2g', title: 'Intro to the CLI', duration: '28:15' },
      { id: 'SDocmq1c05s', title: 'Lab - Basic Device Security', duration: '12:05' },
    ],
    resources: {
      lab: 'Day 04 Lab - Basic Device Security.pkt',
      flashcards: 'Day 04 Flashcards - Intro to the CLI.apkg',
    },
  },
  {
    id: 5,
    day: 5,
    title: 'Ethernet LAN Switching (Part 1)',
    videos: [{ id: 'u2n762WG0Vo', title: 'Ethernet LAN Switching (Part 1)', duration: '21:45' }],
    resources: {
      lab: null,
      flashcards: 'Day 05 Flashcards - Ethernet LAN Switching (Part 1).apkg',
    },
  },
  {
    id: 6,
    day: 6,
    title: 'Ethernet LAN Switching (Part 2)',
    videos: [
      { id: '5q1pqdmdPjo', title: 'Ethernet LAN Switching (Part 2)', duration: '19:30' },
      { id: 'Ig0dSaOQDI8', title: 'Lab - Analyzing Ethernet Switching', duration: '14:34' },
    ],
    resources: {
      lab: 'Day 06 Lab - Ethernet LAN Switching.pkt',
      flashcards: 'Day 06 Flashcards - Ethernet LAN Switching (Part 2).apkg',
    },
  },
  {
    id: 7,
    day: 7,
    title: 'IPv4 Addressing (Part 1)',
    videos: [{ id: '3ROdsfEUuhs', title: 'IPv4 Addressing (Part 1)', duration: '24:18' }],
    resources: {
      lab: null,
      flashcards: 'Day 07 Flashcards - IPv4 Addresses (Part 1).apkg',
    },
  },
  {
    id: 8,
    day: 8,
    title: 'IPv4 Addressing (Part 2)',
    videos: [
      { id: 'FiAatRd84XI', title: 'IPv4 Addressing (Part 2)', duration: '23:42' },
      { id: 'e1jbvyMeS5I', title: 'Lab - Configuring IP Addresses', duration: '09:45' },
    ],
    resources: {
      lab: 'Day 08 Lab - IPv4 Addresses.pkt',
      flashcards: 'Day 08 Flashcards - IPv4 Addresses (Part 2).apkg',
    },
  },
  {
    id: 9,
    day: 9,
    title: 'Switch Interfaces',
    videos: [
      { id: 'cCqluocfQe0', title: 'Switch Interfaces', duration: '18:24' },
      { id: 'rzDb5DoBKRk', title: 'Lab - Configuring Interfaces', duration: '11:32' },
    ],
    resources: {
      lab: 'Day 09 Lab - Interface Configuration.pkt',
      flashcards: 'Day 09 Flashcards - Switch Interfaces.apkg',
    },
  },
  {
    id: 10,
    day: 10,
    title: 'IPv4 Header',
    videos: [{ id: 'aQB22y4liXA', title: 'IPv4 Header', duration: '25:36' }],
    resources: {
      lab: null,
      flashcards: 'Day 10 Flashcards - IPv4 Header.apkg',
    },
  },
  {
    id: 11,
    day: 11,
    title: 'Routing Fundamentals & Static Routing',
    videos: [
      { id: 'aHwAm8GYbn8', title: 'Routing Fundamentals (Part 1)', duration: '25:33' },
      { id: 'YCv4-_sMvYE', title: 'Static Routing (Part 2)', duration: '31:57' },
      { id: 'XHxOtIav2k8', title: 'Lab 1 - Configuring Static Routes', duration: '14:23' },
      { id: '3z8YGEVFTiA', title: 'Lab 2 - Troubleshooting Static Routes', duration: '10:41' },
    ],
    resources: {
      lab: 'Day 11 Lab - Configuring Static Routes.pkt',
      flashcards: 'Day 11 (part 1) Flashcards - Routing Fundamentals.apkg',
    },
  },
  {
    id: 12,
    day: 12,
    title: 'The Life of a Packet',
    videos: [
      { id: '4YrYV2io3as', title: 'The Life of a Packet', duration: '20:58' },
      { id: 'bfsEqDeHbpI', title: 'Lab - Life of a Packet', duration: '14:09' },
    ],
    resources: {
      lab: 'Day 12 Lab - Life of a Packet.pkt',
      flashcards: null,
    },
  },
  {
    id: 13,
    day: 13,
    title: 'Subnetting (Part 1)',
    videos: [{ id: 'bQ8sdpGQu8c', title: 'Subnetting (Part 1)', duration: '26:07' }],
    resources: {
      lab: null,
      flashcards: 'Day 13 Flashcards - Subnetting.apkg',
    },
  },
  {
    id: 14,
    day: 14,
    title: 'Subnetting (Part 2)',
    videos: [{ id: 'IGhd-0di0Qo', title: 'Subnetting (Part 2)', duration: '27:25' }],
    resources: {
      lab: null,
      flashcards: null,
    },
  },
  {
    id: 15,
    day: 15,
    title: 'Subnetting (Part 3 - VLSM)',
    videos: [
      { id: 'z-JqCedc9EI', title: 'Subnetting (Part 3 - VLSM)', duration: '00:00' },
      { id: 'Rn_E1Qv8--I', title: 'Lab - Subnetting (VLSM)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 15 Lab - VLSM.pkt',
      flashcards: null,
    },
  },
  {
    id: 16,
    day: 16,
    title: 'VLANs (Part 1)',
    videos: [
      { id: 'cjFzOnm6u1g', title: 'VLANs (Part 1)', duration: '00:00' },
      { id: '-tq7f3xtyLQ', title: 'Lab - VLANs (Part 1)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 16 Lab - VLANs (Part 1).pkt',
      flashcards: 'Day 16 Flashcards - VLANs (Part 1).apkg',
    },
  },
  {
    id: 17,
    day: 17,
    title: 'VLANs (Part 2)',
    videos: [
      { id: 'Jl9OOzNaBDU', title: 'VLANs (Part 2)', duration: '00:00' },
      { id: 'iRkFE_lpYgc', title: 'Lab - VLANs (Part 2)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 17 Lab - VLANs (Part 2).pkt',
      flashcards: 'Day 17 Flashcards - VLANs (Part 2).apkg',
    },
  },
  {
    id: 18,
    day: 18,
    title: 'VLANs (Part 3)',
    videos: [
      { id: 'OkPB028l2eE', title: 'VLANs (Part 3)', duration: '00:00' },
      { id: 'MQcCr3QW1vE', title: 'Lab - VLANs (Part 3)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 18 Lab - Multilayer Switching.pkt',
      flashcards: 'Day 18 Flashcards - VLANs (Part 3).apkg',
    },
  },
  {
    id: 19,
    day: 19,
    title: 'DTP/VTP',
    videos: [
      { id: 'JtQV_0Sjszg', title: 'DTP/VTP', duration: '00:00' },
      { id: 'ngTns2vF_44', title: 'Lab - DTP/VTP', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 19 Lab - DTP & VTP.pkt',
      flashcards: 'Day 19 Flashcards - DTP & VTP.apkg',
    },
  },
  {
    id: 20,
    day: 20,
    title: 'Spanning Tree Protocol (Part 1)',
    videos: [
      { id: 'j-bK-EFt9cY', title: 'Spanning Tree Protocol (Part 1)', duration: '00:00' },
      { id: 'Ev9gy7B5hx0', title: 'Lab - Analyzing STP', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 20 Lab - Analyzing STP.pkt',
      flashcards: 'Day 20 Flashcards - STP (Part 1).apkg',
    },
  },
  {
    id: 21,
    day: 21,
    title: 'Spanning Tree Protocol (Part 2)',
    videos: [
      { id: 'nWpldCc8msY', title: 'Spanning Tree Protocol (Part 2)', duration: '00:00' },
      { id: 'zqzppl4LOwk', title: 'PortFast (STP Toolkit)', duration: '00:00' },
      { id: 'jfC_AeJnuhY', title: 'BPDU Guard & BPDU Filter (STP Toolkit)', duration: '00:00' },
      { id: '2XE_PgkvSic', title: 'Root Guard (STP Toolkit)', duration: '00:00' },
      { id: 'uJ5_Klha0ig', title: 'Loop Guard (STP Toolkit)', duration: '00:00' },
      { id: '5rpaeJNig2o', title: 'Lab - Configuring STP (PVST+)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 21 Lab - Configuring Spanning Tree.pkt',
      flashcards: 'Day 21 Flashcards - STP (Part 2).apkg',
    },
  },
  {
    id: 22,
    day: 22,
    title: 'Rapid Spanning Tree Protocol',
    videos: [
      { id: 'EpazNsLlPps', title: 'Rapid Spanning Tree Protocol', duration: '00:00' },
      { id: 'YG7r4XHy2JU', title: 'Lab - Rapid STP', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 22 Lab - Rapid STP.pkt',
      flashcards: 'Day 22 Flashcards - Rapid STP.apkg',
    },
  },
  {
    id: 23,
    day: 23,
    title: 'EtherChannel',
    videos: [
      { id: 'xuo69Joy_Nc', title: 'EtherChannel', duration: '00:00' },
      { id: '8gKF2fMMjA8', title: 'Lab - Configuring EtherChannel', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 23 Lab - EtherChannel.pkt',
      flashcards: 'Day 23 Flashcards - EtherChannel.apkg',
    },
  },
  {
    id: 24,
    day: 24,
    title: 'Dynamic Routing',
    videos: [
      { id: 'xSTgb8JLkvs', title: 'Dynamic Routing', duration: '00:00' },
      { id: 'KuKC0G3LZc8', title: 'Lab - Floating Static Routes', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 24 Lab - Floating Static Routes.pkt',
      flashcards: 'Day 24 Flashcards - Dynamic Routing.apkg',
    },
  },
  {
    id: 25,
    day: 25,
    title: 'RIP & EIGRP',
    videos: [
      { id: 'N8PiZDld6Zc', title: 'RIP & EIGRP', duration: '00:00' },
      { id: 'ffnJ5oBIObY', title: 'Lab - Configuring EIGRP', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 25 Lab - EIGRP Configuration.pkt',
      flashcards: 'Day 25 Flashcards (1) - RIP & EIGRP.apkg',
    },
  },
  {
    id: 26,
    day: 26,
    title: 'OSPF Part 1',
    videos: [
      { id: 'H8W9oMNSuwo', title: 'OSPF Part 1', duration: '00:00' },
      { id: 'ieTH5lVhNaY', title: 'Lab - Configuring OSPF (1)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 26 Lab - OSPF (Part 1).pkt',
      flashcards: 'Day 26 Flashcards - OSPF (Part 1).apkg',
    },
  },
  {
    id: 27,
    day: 27,
    title: 'OSPF Part 2',
    videos: [
      { id: 'K6Qt23sY68Y', title: 'OSPF Part 2', duration: '00:00' },
      { id: 't-ai8JzhHuY', title: 'Lab - Configuring OSPF (2)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 27 Lab - OSPF (Part 2).pkt',
      flashcards: 'Day 27 Flashcards - OSPF (Part 2).apkg',
    },
  },
  {
    id: 28,
    day: 28,
    title: 'OSPF Part 3',
    videos: [
      { id: '7nmYoL0t2tU', title: 'OSPF Part 3', duration: '00:00' },
      { id: 'IYbtai7Nu2g', title: 'Lab - Configuring OSPF (3)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 28 Lab - OSPF (Part 3).pkt',
      flashcards: 'Day 28 Flashcards - OSPF (Part 3).apkg',
    },
  },
  {
    id: 29,
    day: 29,
    title: 'First Hop Redundancy Protocols',
    videos: [
      { id: 'SDocmq1c05s', title: 'First Hop Redundancy Protocols', duration: '00:00' },
      { id: 'u2n762WG0Vo', title: 'Lab - Configuring HSRP', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 29 Lab - HSRP Configuration.pkt',
      flashcards: 'Day 29 Flashcards - FHRPs.apkg',
    },
  },
  {
    id: 30,
    day: 30,
    title: 'TCP & UDP',
    videos: [
      { id: '5q1pqdmdPjo', title: 'TCP & UDP', duration: '00:00' },
      { id: 'Ig0dSaOQDI8', title: 'Lab - Wireshark Demo (TCP/UDP)', duration: '00:00' },
    ],
    resources: {
      lab: null,
      flashcards: 'Day 30 Flashcards - TCP & UDP.apkg',
    },
  },
  {
    id: 31,
    day: 31,
    title: 'IPv6 Part 1',
    videos: [
      { id: '3ROdsfEUuhs', title: 'IPv6 Part 1', duration: '00:00' },
      { id: 'FiAatRd84XI', title: 'Lab - Configuring IPv6 (Part 1)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 31 Lab - IPv6 Configuration (Part 1).pkt',
      flashcards: 'Day 31 Flashcards - IPv6 (Part 1).apkg',
    },
  },
  {
    id: 32,
    day: 32,
    title: 'IPv6 Part 2',
    videos: [
      { id: 'cCqluocfQe0', title: 'IPv6 Part 2', duration: '00:00' },
      { id: 'aQB22y4liXA', title: 'Lab - Configuring IPv6 (Part 2)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 32 Lab - IPv6 Configuration (Part 2).pkt',
      flashcards: 'Day 32 Flashcards - IPv6 (Part 2).apkg',
    },
  },
  {
    id: 33,
    day: 33,
    title: 'IPv6 Part 3',
    videos: [
      { id: 'aHwAm8GYbn8', title: 'IPv6 Part 3', duration: '00:00' },
      { id: '4YrYV2io3as', title: 'Lab - Configuring IPv6 (Part 3)', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 33 Lab - IPv6 Static Routes.pkt',
      flashcards: 'Day 33 Flashcards - IPv6 (Part 3).apkg',
    },
  },
  {
    id: 34,
    day: 34,
    title: 'Standard ACLs',
    videos: [
      { id: 'bQ8sdpGQu8c', title: 'Standard ACLs', duration: '00:00' },
      { id: 'IGhd-0di0Qo', title: 'Lab - Standard ACLs', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 34 Lab - Standard ACLs.pkt',
      flashcards: 'Day 34 Flashcards - Standard ACLs.apkg',
    },
  },
  {
    id: 35,
    day: 35,
    title: 'Extended ACLs',
    videos: [
      { id: 'z-JqCedc9EI', title: 'Extended ACLs', duration: '00:00' },
      { id: 'cjFzOnm6u1g', title: 'Lab - Extended ACLs', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 35 Lab - Extended ACLs.pkt',
      flashcards: 'Day 35 Flashcards - Extended ACLs.apkg',
    },
  },
  {
    id: 36,
    day: 36,
    title: 'CDP & LLDP',
    videos: [
      { id: 'Jl9OOzNaBDU', title: 'CDP & LLDP', duration: '00:00' },
      { id: 'OkPB028l2eE', title: 'Lab - CDP & LLDP', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 36 Lab - CDP & LLDP.pkt',
      flashcards: 'Day 36 Flashcards - CDP & LLDP.apkg',
    },
  },
  {
    id: 37,
    day: 37,
    title: 'NTP',
    videos: [
      { id: 'JtQV_0Sjszg', title: 'NTP', duration: '00:00' },
      { id: 'j-bK-EFt9cY', title: 'Lab - NTP', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 37 Lab - NTP.pkt',
      flashcards: 'Day 37 Flashcards - NTP.apkg',
    },
  },
  {
    id: 38,
    day: 38,
    title: 'DNS',
    videos: [
      { id: 'nWpldCc8msY', title: 'DNS', duration: '00:00' },
      { id: 'EpazNsLlPps', title: 'Lab - DNS', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 38 Lab - DNS.pkt',
      flashcards: 'Day 38 Flashcards - DNS.apkg',
    },
  },
  {
    id: 39,
    day: 39,
    title: 'DHCP',
    videos: [
      { id: 'xuo69Joy_Nc', title: 'DHCP', duration: '00:00' },
      { id: 'xSTgb8JLkvs', title: 'Lab - DHCP', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 39 Lab - DHCP.pkt',
      flashcards: 'Day 39 Flashcards - DHCP.apkg',
    },
  },
  {
    id: 40,
    day: 40,
    title: 'SNMP',
    videos: [
      { id: 'N8PiZDld6Zc', title: 'SNMP', duration: '00:00' },
      { id: 'pvuaoJ9YzoI', title: 'Lab - SNMP', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 40 Lab - SNMP.pkt',
      flashcards: 'Day 40 Flashcards - SNMP.apkg',
    },
  },
  {
    id: 41,
    day: 41,
    title: 'Syslog',
    videos: [
      { id: 'VtzfTA21ht0', title: 'Syslog', duration: '00:00' },
      { id: '3ew26ujkiDI', title: 'Lab - Syslog', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 41 Lab - Syslog.pkt',
      flashcards: 'Day 41 Flashcards - Syslog.apkg',
    },
  },
  {
    id: 42,
    day: 42,
    title: 'SSH',
    videos: [
      { id: '43WnpwQMolo', title: 'SSH', duration: '00:00' },
      { id: 'LIEACBqlntY', title: 'Lab - SSH', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 42 Lab - SSH.pkt',
      flashcards: 'Day 42 Flashcards - SSH.apkg',
    },
  },
  {
    id: 43,
    day: 43,
    title: 'FTP & TFTP',
    videos: [
      { id: 'ZNuXyOXae5U', title: 'FTP & TFTP', duration: '00:00' },
      { id: 'BrTMMOXFhDU', title: 'Lab - FTP & TFTP', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 43 Lab - FTP & TFTP.pkt',
      flashcards: 'Day 43 Flashcards - FTP & TFTP.apkg',
    },
  },
  {
    id: 44,
    day: 44,
    title: 'NAT (Part 1)',
    videos: [
      { id: 'rwkHfsWQwy8', title: 'NAT (Part 1)', duration: '00:00' },
      { id: 'z023_eRUtSo', title: 'Lab - Static NAT', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 44 Lab - Static NAT.pkt',
      flashcards: 'Day 44 Flashcards - NAT (Part 1).apkg',
    },
  },
  {
    id: 45,
    day: 45,
    title: 'NAT (part 2)',
    videos: [
      { id: 'dUttKY_CNXE', title: 'NAT (part 2)', duration: '00:00' },
      { id: '_hnMZBzXRRk', title: 'Lab - Dynamic NAT', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 45 Lab - Dynamic NAT.pkt',
      flashcards: 'Day 45 Flashcards - NAT (Part 2).apkg',
    },
  },
  {
    id: 46,
    day: 46,
    title: 'QoS (Part 1)',
    videos: [
      { id: 'qGJaJx7OfUo', title: 'QoS (Part 1)', duration: '00:00' },
      { id: '4C6eeQes4cs', title: 'Lab - Voice VLANs', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 46 Lab - Voice VLANs.pkt',
      flashcards: 'Day 46 Flashcards - QoS (Part 1).apkg',
    },
  },
  {
    id: 47,
    day: 47,
    title: 'QoS (Part 2)',
    videos: [
      { id: 'hzkleGAC2_Y', title: 'QoS (Part 2)', duration: '00:00' },
      { id: 'HXu0Ifj0oWU', title: 'Lab - QoS', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 47 Lab - QoS.pkt',
      flashcards: 'Day 47 Flashcards - QoS (Part 2).apkg',
    },
  },
  {
    id: 48,
    day: 48,
    title: 'Security Fundamentals',
    videos: [
      { id: 'RaQPSKQ4J5A', title: 'Security Fundamentals', duration: '00:00' },
      { id: 'AvgYqI2qSD4', title: 'Lab - Kali Linux Demo', duration: '00:00' },
    ],
    resources: {
      lab: null,
      flashcards: 'Day 48 Flashcards - Security Fundamentals.apkg',
    },
  },
  {
    id: 49,
    day: 49,
    title: 'Port Security',
    videos: [
      { id: '50hcfsoBf4Q', title: 'Port Security', duration: '00:00' },
      { id: '2TZCfTgopeg', title: 'Lab - Port Security', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 49 Lab - Port Security.pkt',
      flashcards: 'Day 49 Flashcards - Port Security.apkg',
    },
  },
  {
    id: 50,
    day: 50,
    title: 'DHCP Snooping',
    videos: [
      { id: 'kILDNs4KjYE', title: 'DHCP Snooping', duration: '00:00' },
      { id: 'H6FKJMiiL6E', title: 'Lab - DHCP Snooping', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 50 Lab - DHCP Snooping.pkt',
      flashcards: 'Day 50 Flashcards - DHCP Snooping.apkg',
    },
  },
  {
    id: 51,
    day: 51,
    title: 'Dynamic ARP Inspection',
    videos: [
      { id: '4vurfhVjcMM', title: 'Dynamic ARP Inspection', duration: '00:00' },
      { id: 'VvFuieyTTSw', title: 'Lab - Dynamic ARP Inspection', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 51 Lab - Dynamic ARP Inspection.pkt',
      flashcards: 'Day 51 Flashcards - Dynamic ARP Inspection.apkg',
    },
  },
  {
    id: 52,
    day: 52,
    title: 'LAN Architectures',
    videos: [
      { id: 'sHN3jOJIido', title: 'LAN Architectures', duration: '00:00' },
      { id: 'qYYeg2kz1yE', title: 'Lab - STP & FHRP Synchronization', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 52 Lab - STP & HSRP Synchronization.pkt',
      flashcards: 'Day 52  Flashcards - LAN Architectures.apkg',
    },
  },
  {
    id: 53,
    day: 53,
    title: 'WAN Architectures',
    videos: [
      { id: 'HwbTKaIvL6s', title: 'WAN Architectures', duration: '00:00' },
      { id: 'PvyEcLhmNBk', title: 'Lab - GRE Tunnels', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 53 Lab - GRE Tunnels.pkt',
      flashcards: 'Day 53 Flashcards - WAN Architectures.apkg',
    },
  },
  {
    id: 54,
    day: 54,
    title: 'Virtualization & Cloud',
    videos: [
      { id: 'BW3fQgdf4-w', title: 'Virtualization & Cloud (part 1)', duration: '00:00' },
      { id: '_S3greGajJA', title: 'Containers (part 2)', duration: '00:00' },
      { id: 'zuYiktLqNYQ', title: 'VRF (part 3)', duration: '00:00' },
      { id: 'uX1h0F6wpBY', title: 'Lab - Oracle VirtualBox', duration: '00:00' },
    ],
    resources: {
      lab: null,
      flashcards: 'Day 54 (Part 1) Flashcards - Virtualization & Cloud.apkg',
    },
  },
  {
    id: 55,
    day: 55,
    title: 'Wireless Fundamentals',
    videos: [{ id: 'wHXKo9So5y8', title: 'Wireless Fundamentals', duration: '00:00' }],
    resources: {
      lab: null,
      flashcards: 'Day 55 Flashcards - Wireless Fundamentals.apkg',
    },
  },
  {
    id: 56,
    day: 56,
    title: 'Wireless Architectures',
    videos: [{ id: 'r9o6GFI87go', title: 'Wireless Architectures', duration: '00:00' }],
    resources: {
      lab: null,
      flashcards: 'Day 56 Flashcards - Wireless Architectures.apkg',
    },
  },
  {
    id: 57,
    day: 57,
    title: 'Wireless Security',
    videos: [{ id: '4tsBgMCPVuc', title: 'Wireless Security', duration: '00:00' }],
    resources: {
      lab: null,
      flashcards: 'Day 57 Flashcards - Wireless Security.apkg',
    },
  },
  {
    id: 58,
    day: 58,
    title: 'Wireless Configuration',
    videos: [
      { id: 'nohde2-QNJ4', title: 'Wireless Configuration', duration: '00:00' },
      { id: 'Luei0p-2h10', title: 'Lab - Wireless LANs', duration: '00:00' },
    ],
    resources: {
      lab: 'Day 58 Lab - Wireless LANs.pkt',
      flashcards: 'Day 58 Flashcards - Wireless Configuration.apkg',
    },
  },
  {
    id: 59,
    day: 59,
    title: 'Intro to Network Automation',
    videos: [
      { id: '7HhWCeXDTpA', title: 'Intro to Network Automation (part 1)', duration: '00:00' },
      { id: 'Kog9gHTjALI', title: 'AI & Machine Learning (part 2)', duration: '00:00' },
    ],
    resources: {
      lab: null,
      flashcards: 'Day 59 (Part 1) Flashcards - Network Automation.apkg',
    },
  },
  {
    id: 60,
    day: 60,
    title: 'JSON, XML, & YAML',
    videos: [{ id: 'nohde2-QNJ4', title: 'JSON, XML, & YAML', duration: '00:00' }],
    resources: {
      lab: null,
      flashcards: 'Day 60 Flashcards - JSON, XML, & YAML.apkg',
    },
  },
  {
    id: 61,
    day: 61,
    title: 'REST APIs',
    videos: [
      { id: 'Luei0p-2h10', title: 'REST APIs (part 1)', duration: '00:00' },
      { id: 'bmqr_xpt6sc', title: 'REST API Authentication (part 2)', duration: '00:00' },
    ],
    resources: {
      lab: null,
      flashcards: 'Day 61 (Part 1) Flashcards - REST APIs.apkg',
    },
  },
  {
    id: 62,
    day: 62,
    title: 'Software-Defined Networking',
    videos: [{ id: '7HhWCeXDTpA', title: 'Software-Defined Networking', duration: '00:00' }],
    resources: {
      lab: null,
      flashcards: 'Day 62 Flashcards - SDN.apkg',
    },
  },
  {
    id: 63,
    day: 63,
    title: 'Ansible, Puppet, & Chef',
    videos: [
      { id: 'Kog9gHTjALI', title: 'Ansible, Puppet, & Chef (part 1)', duration: '00:00' },
      { id: 'VAwUaffejWU', title: 'Terraform (part 2)', duration: '00:00' },
    ],
    resources: {
      lab: null,
      flashcards: 'Day 63 (part 1) Flashcards - Ansible, Puppet, Chef.apkg',
    },
  },
];

export default modules;
