export const posts = [
  {
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
