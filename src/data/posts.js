export const posts = [
  {
    slug: 'building-my-physical-ccna-homelab',
    title: 'The End of Simulation: Building a CCNA Lab With Physical Cisco Hardware',
    subtitle:
      'How I built an isolated Cisco lab environment from physical hardware — a 2600 router, a Catalyst 3500XL switch, and a Linksys buffer — and why starting with real gear changed everything about how I learn networking.',
    date: 'April 3, 2026',
    readTime: '~10 min read',
    category: 'Homelab',
    difficulty: 'Beginner',
    difficultyColor: 'green',
    badges: [
      { label: 'CCNA',          color: 'gold'   },
      { label: 'Physical Lab',  color: 'green'  },
      { label: 'Cisco IOS',     color: 'cyan'   },
      { label: 'Lab Walkthrough', color: 'purple' },
    ],
    sections: [
      {
        id: 'origin',
        number: '01',
        title: 'Why Physical Gear',
        content: [
          {
            type: 'p',
            text: 'Most people studying for the CCNA use Packet Tracer or GNS3. Those are solid tools. But there is something different about plugging a console cable into a real Cisco 2600 router, watching IOS boot from NVRAM, and knowing that the traffic you are troubleshooting is actual electrons moving through actual hardware.',
          },
          {
            type: 'p',
            text: 'That is why I built this lab. Not because simulators are wrong — they are not — but because physical gear forces you to deal with real constraints: IOS version limitations, cable management, interface states that do not behave the way the documentation says they should. Those friction points are the curriculum the exam doesn\'t cover.',
          },
          {
            type: 'callout',
            variant: 'info',
            heading: 'Lab Philosophy',
            text: 'A simulator shows you how networking is supposed to work. Physical hardware shows you how it actually works. For CCNA and beyond, understanding that gap is the difference between someone who passed a test and someone who can troubleshoot a production network.',
          },
        ],
      },
      {
        id: 'hardware',
        number: '02',
        title: 'Hardware Inventory',
        content: [
          {
            type: 'p',
            text: 'The lab is built around physical Cisco gear acquired specifically for hands-on CCNA practice. Here is what is on the bench:',
          },
          {
            type: 'table',
            headers: ['Device', 'Role'],
            rows: [
              ['Cisco 2600 Router',      'Lab gateway — routing, DHCP, NAT, ACLs, remote management'],
              ['Cisco 1700 Router',      'Secondary router for multi-router topologies and WAN simulation'],
              ['Catalyst 3500XL Switch', 'Core lab LAN switch — VLANs, trunking, STP, SPAN'],
              ['Linksys E2500',          'Safety buffer router between lab and primary home network'],
              ['MacBook Pro 2015',       'Control station — console access, Wireshark captures, SSH client'],
              ['Raspberry Pi',           'Planned — TFTP server, lab endpoint, automation platform'],
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            heading: 'Why the Linksys Buffer?',
            text: 'The Linksys E2500 sits between the Cisco lab and the upstream home network. This means that if I misconfigure routing, break DHCP, or cause a broadcast storm in the lab — none of it touches the primary household network. It is a simple but critical design decision for a home lab.',
          },
        ],
      },
      {
        id: 'topology',
        number: '03',
        title: 'Network Topology',
        content: [
          {
            type: 'p',
            text: 'The lab is architected in two layers: a safety buffer layer and the Cisco lab layer. The buffer router performs NAT and DHCP for the lab environment, keeping it cleanly isolated from the upstream home network.',
          },
          {
            type: 'h3',
            text: 'Current Network Flow',
          },
          {
            type: 'terminal',
            lines: [
              { type: 'out', text: 'Internet' },
              { type: 'out', text: '   ↓' },
              { type: 'out', text: 'Xfinity Gateway' },
              { type: 'out', text: '   ↓' },
              { type: 'out', text: 'Linksys E2500  (NAT + DHCP — 192.168.50.0/24)' },
              { type: 'out', text: '   ↓' },
              { type: 'out', text: 'Cisco 2600     (Static WAN: 192.168.50.10)' },
              { type: 'out', text: '   ↓' },
              { type: 'out', text: 'MacBook Pro    (Console management)' },
            ],
          },
          {
            type: 'h3',
            text: 'Planned Expansion',
          },
          {
            type: 'terminal',
            lines: [
              { type: 'out', text: 'Cisco 2600' },
              { type: 'out', text: '   ↓' },
              { type: 'out', text: 'Catalyst 3500XL Switch' },
              { type: 'out', text: '   ↓' },
              { type: 'out', text: 'Internal Lab LAN  (10.0.0.0/24)' },
              { type: 'out', text: '   ↓' },
              { type: 'out', text: 'Lab Endpoints (Raspberry Pi, additional hosts)' },
            ],
          },
          {
            type: 'p',
            text: 'The lab LAN uses 192.168.50.0/24 deliberately — different from the upstream home network on 192.168.1.0/24. Subnet overlap is one of the most common home lab mistakes and one of the first things the buffer router design prevents.',
          },
        ],
      },
      {
        id: 'buffer',
        number: '04',
        title: 'Buffer Router Configuration',
        content: [
          {
            type: 'p',
            text: 'The Linksys E2500 required three configuration changes before the lab was operational:',
          },
          {
            type: 'h3',
            text: 'LAN Address Change',
          },
          {
            type: 'p',
            text: 'The default LAN IP was changed to prevent subnet overlap with the upstream home network:',
          },
          {
            type: 'terminal',
            lines: [
              { type: 'out', text: 'Router LAN IP:  192.168.50.1' },
              { type: 'out', text: 'Subnet:         192.168.50.0/24' },
              { type: 'out', text: 'DHCP Range:     192.168.50.100 - 192.168.50.200' },
            ],
          },
          {
            type: 'h3',
            text: 'Wireless Hardening',
          },
          {
            type: 'terminal',
            lines: [
              { type: 'out', text: 'SSID:        NetOpsLab' },
              { type: 'out', text: 'Encryption:  WPA2 Personal (AES)' },
              { type: 'out', text: 'WPS:         Disabled — switched to manual configuration' },
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            heading: 'Why Disable WPS?',
            text: 'WPS has well-documented vulnerabilities. Disabling it and switching to manual SSID configuration is a basic hardening step — and a good habit to build before you start studying network security in depth.',
          },
        ],
      },
      {
        id: 'cisco2600',
        number: '05',
        title: 'Cisco 2600 Router Configuration',
        content: [
          {
            type: 'p',
            text: 'The 2600 is the centerpiece of the lab. Initial configuration involved bringing up the WAN interface, establishing internet reachability, and configuring remote management access.',
          },
          {
            type: 'h3',
            text: 'WAN Interface — DHCP to Static',
          },
          {
            type: 'p',
            text: 'The WAN interface initially received its address via DHCP from the Linksys buffer. DHCP assignments change on reboot, which breaks remote management. The interface was converted to a static address for stable access:',
          },
          {
            type: 'code',
            lang: 'ios',
            text: `! Initial DHCP configuration
interface FastEthernet0/1
 ip address dhcp
 no shutdown

! Converted to static for stable management
Router# configure terminal
Router(config)# interface FastEthernet0/1
Router(config-if)# no ip address dhcp
Router(config-if)# ip address 192.168.50.10 255.255.255.0
Router(config-if)# no shutdown`,
          },
          {
            type: 'h3',
            text: 'Verification',
          },
          {
            type: 'terminal',
            lines: [
              { type: 'prompt', text: 'Router# ping 192.168.50.1' },
              { type: 'out',    text: 'Success rate is 100 percent (5/5)' },
              { type: 'prompt', text: 'Router# ping 8.8.8.8' },
              { type: 'out',    text: 'Success rate is 100 percent (5/5)' },
            ],
          },
          {
            type: 'p',
            text: 'After verification, the configuration was saved to NVRAM:',
          },
          {
            type: 'terminal',
            lines: [
              { type: 'prompt', text: 'Router# write memory' },
              { type: 'out',    text: 'Building configuration...' },
              { type: 'out',    text: '[OK]' },
            ],
          },
          {
            type: 'callout',
            variant: 'warn',
            heading: 'Always Save Before Rebooting',
            text: 'Cisco routers run their active configuration in RAM. A reboot without write memory means starting over from the last saved config. Building this habit early saves significant pain in both lab and production environments.',
          },
        ],
      },
      {
        id: 'telnet-ssh',
        number: '06',
        title: 'Remote Management: Telnet Now, SSH Later',
        content: [
          {
            type: 'p',
            text: 'During remote management configuration, I hit a real-world constraint: the IOS image on the 2600 does not support the crypto features required for SSH.',
          },
          {
            type: 'terminal',
            lines: [
              { type: 'out', text: 'IOS Version: Cisco IOS (C2600-D-M), Version 12.1(3)T' },
              { type: 'out', text: 'Crypto features: Not supported in this image' },
            ],
          },
          {
            type: 'p',
            text: 'Telnet was implemented as a temporary solution via the VTY lines while planning an IOS upgrade to a crypto-capable image:',
          },
          {
            type: 'code',
            lang: 'ios',
            text: `Router(config)# line vty 0 4
Router(config-line)# password cisco
Router(config-line)# login
Router(config-line)# transport input telnet`,
          },
          {
            type: 'callout',
            variant: 'danger',
            heading: 'Telnet is Cleartext — Lab Only',
            text: 'Telnet transmits everything — including passwords — in plaintext. This is acceptable in an isolated lab environment but would never be used in production. The planned IOS upgrade will replace this with SSH, and that upgrade process will become its own lab writeup.',
          },
          {
            type: 'p',
            text: 'The planned SSH configuration after the IOS upgrade:',
          },
          {
            type: 'code',
            lang: 'ios',
            text: `Router(config)# ip domain-name ccnahome.lab
Router(config)# username admin privilege 15 secret <password>
Router(config)# crypto key generate rsa
Router(config)# ip ssh version 2
Router(config)# line vty 0 4
Router(config-line)# transport input ssh
Router(config-line)# login local`,
          },
        ],
      },
      {
        id: 'current-state',
        number: '07',
        title: 'Current Lab State & What Is Next',
        content: [
          {
            type: 'p',
            text: 'The lab currently provides a stable, isolated foundation for CCNA practice. Here is where things stand:',
          },
          {
            type: 'table',
            headers: ['Item', 'Status'],
            rows: [
              ['Safety buffer network (Linksys)',     '✓ Complete'],
              ['Cisco 2600 static WAN interface',     '✓ Complete'],
              ['Default routing to upstream gateway', '✓ Complete'],
              ['Internet reachability verified',      '✓ Complete'],
              ['Telnet remote management',            '✓ Complete'],
              ['IOS upgrade for SSH support',         '⟳ Planned'],
              ['Catalyst 3500XL switch integration',  '⟳ Planned'],
              ['Internal lab LAN (10.0.0.0/24)',      '⟳ Planned'],
              ['Raspberry Pi endpoint',               '⟳ Planned'],
            ],
          },
          {
            type: 'callout',
            variant: 'success',
            heading: 'The Lab Has Since Expanded',
            text: 'Since this initial build, the Catalyst 3500XL switch has been integrated, VLAN segmentation and STP labs are running, and Wireshark packet captures are being conducted from the MacBook via SPAN port mirroring. The homelab is now the foundation for active CCNA 200-301 study targeting May 2026.',
          },
          {
            type: 'p',
            text: 'The full lab documentation, configs, and topology diagrams are available in the GitHub repository: cornerstonian/netops-ccna-homelab',
          },
        ],
      },
      {
        id: 'takeaways',
        number: '08',
        title: 'What Physical Gear Taught Me That Simulators Did Not',
        content: [
          {
            type: 'p',
            text: 'A few things you only learn from physical hardware:',
          },
          {
            type: 'table',
            headers: ['Lesson', 'Why It Matters'],
            rows: [
              ['IOS versions have real feature limitations', 'Not every command exists on every image — you learn to check before assuming'],
              ['Interface states are not instant',           'Physical links have negotiation time, STP convergence, and real delay'],
              ['write memory is a habit, not a step',        'RAM-based config means an accidental reload costs you everything unsaved'],
              ['Subnet planning prevents pain',              'Overlapping address space with the home network is a real mistake with real consequences'],
              ['Console cables are still essential',         'When remote access breaks, the console port is the only way back in'],
            ],
          },
          {
            type: 'p',
            text: 'None of these lessons are unique to physical gear — but all of them hit differently when the consequences are real. That is the value of the homelab.',
          },
        ],
      },
    ],
  },
  {
    hidden: true,
    slug: 'packet-analysis-deep-dive',
    title: 'Packet Analysis Deep Dive: Capturing & Dissecting Live Traffic',
    subtitle:
      'A hands-on walkthrough of passive network sniffing, protocol identification, and credential exposure using Wireshark and tcpdump on a live LAN segment.',
    date: 'March 31, 2026',
    readTime: '~12 min read',
    category: 'Security Labs',
    difficulty: 'Intermediate',
    difficultyColor: 'gold',
    badges: [
      { label: 'CCNA',             color: 'gold'   },
      { label: 'Network Security',  color: 'green'  },
      { label: 'Wireshark',         color: 'cyan'   },
      { label: 'Lab Walkthrough',   color: 'purple' },
    ],
    sections: [
      {
        id: 'overview',
        number: '01',
        title: 'Overview & Objectives',
        content: [
          {
            type: 'p',
            text: 'This lab covers passive traffic analysis on a local network segment using Wireshark and tcpdump. The goal is to understand what an attacker — or a security analyst — can observe on an unencrypted network without sending a single packet.',
          },
          {
            type: 'callout',
            variant: 'warn',
            heading: 'Legal Notice',
            text: 'Packet capture should only be performed on networks you own or have explicit written permission to test. This lab was conducted in an isolated home lab environment.',
          },
          {
            type: 'p',
            text: 'By the end of this walkthrough you will know how to place your NIC in promiscuous mode, apply capture filters, reconstruct TCP streams, and identify credential leakage over cleartext protocols like HTTP, FTP, and Telnet.',
          },
        ],
      },
      {
        id: 'environment',
        number: '02',
        title: 'Lab Environment Setup',
        content: [
          {
            type: 'table',
            headers: ['Component', 'Tool / Device', 'Role'],
            rows: [
              ['Capture Host',   'MacBook Pro 2015 (macOS Monterey 12.7.6)', 'Analyst machine'],
              ['Target Traffic', 'Cisco 2600 Router',               'Traffic generator'],
              ['Capture Tool',   'Wireshark 4.x / tcpdump',         'Passive sniffer'],
              ['Switch',         'Catalyst 3500XL',                  'Port mirror (SPAN)'],
            ],
          },
          {
            type: 'h3',
            text: 'Enable Promiscuous Mode',
          },
          {
            type: 'p',
            text: 'Before launching Wireshark, verify the NIC is set to promiscuous mode via the terminal:',
          },
          {
            type: 'terminal',
            lines: [
              { type: 'prompt', text: '$ ifconfig en5' },
              { type: 'out',    text: 'en5: flags=8963<UP,BROADCAST,SMART,RUNNING,PROMISC,SIMPLEX,MULTICAST> mtu 1500' },
              { type: 'out',    text: '    ether 00:1a:2b:3c:4d:5e' },
              { type: 'out',    text: '    inet 192.168.1.50 netmask 0xffffff00 broadcast 192.168.1.255' },
            ],
          },
          {
            type: 'callout',
            variant: 'info',
            heading: 'CCNA Exam Note',
            text: 'On managed switches, you need a SPAN (Switched Port Analyzer) port configured to mirror traffic to your capture interface. Without it, a switch only forwards frames to the destination MAC — your sniffer sees nothing useful.',
          },
        ],
      },
      {
        id: 'capture',
        number: '03',
        title: 'Capturing Live Traffic',
        content: [
          {
            type: 'p',
            text: 'Start a targeted capture using a BPF (Berkeley Packet Filter) to reduce noise. The filter below captures only TCP traffic on port 80 and 23.',
          },
          {
            type: 'code',
            lang: 'tcpdump',
            text: `# Capture HTTP and Telnet to file\ntcpdump -i eth0 \\\n  -w capture_lab01.pcap \\\n  -n -v \\\n  'tcp port 80 or tcp port 23'\n\n# Live view with timestamps\ntcpdump -i eth0 -tttt -A 'host 192.168.1.1'`,
          },
        ],
      },
      {
        id: 'analysis',
        number: '04',
        title: 'Protocol Analysis',
        content: [
          {
            type: 'h3',
            text: 'Reconstructing TCP Streams',
          },
          {
            type: 'p',
            text: 'In Wireshark: right-click any packet in a session → Follow → TCP Stream. This reconstructs the full conversation between client and server, making credential extraction trivial on unencrypted protocols.',
          },
          {
            type: 'callout',
            variant: 'danger',
            heading: 'Finding: Cleartext Credentials',
            text: 'FTP and Telnet transmit usernames and passwords in plaintext. During this lab, credentials were captured in full within 3 seconds of initiating a Follow TCP Stream on port 21.',
          },
          {
            type: 'callout',
            variant: 'success',
            heading: 'Mitigation',
            text: 'Replace FTP with SFTP (port 22). Replace Telnet with SSH. Force HTTPS via HSTS headers. Implement 802.1X port-based auth on switches.',
          },
        ],
      },
      {
        id: 'takeaways',
        number: '05',
        title: 'Interview Takeaways',
        content: [
          {
            type: 'p',
            text: 'These are the points most likely to come up in a Help Desk, Network Admin, or Security role interview:',
          },
          {
            type: 'table',
            headers: ['Question Pattern', 'Your Answer Frame'],
            rows: [
              ['"What is promiscuous mode?"',  'NIC accepts all frames on the wire, not just those addressed to its MAC'],
              ['"What\'s a SPAN port?"',        'Switch feature that mirrors traffic from one port to another for analysis'],
              ['"Why is Telnet bad?"',          'Cleartext transmission — credentials visible to any sniffer on the segment'],
              ['"How do you detect sniffing?"', 'ARP watch, interface promisc flags, latency anomalies, IDS alerts'],
            ],
          },
        ],
      },
    ],
  },
]

export function getPost(slug) {
  return posts.find((p) => p.slug === slug) || null
}
