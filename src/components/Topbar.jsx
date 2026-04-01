import { Link } from 'react-router-dom'
import styles from './Topbar.module.css'

export default function Topbar() {
  return (
    <nav className={styles.topbar}>
      <a href="https://lavoisier.dev" className={styles.brand}>← lavoisier.dev</a>
      <ul className={styles.nav}>
        <li><Link to="/">Blog</Link></li>
        <li><a href="https://commandcenter.lavoisier.dev">Command Center</a></li>
        <li><a href="https://lavoisier.dev#contact">Contact</a></li>
      </ul>
    </nav>
  )
}
