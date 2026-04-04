import { Link } from 'react-router-dom'
import Topbar from '../components/Topbar'
import { posts } from '../data/posts'
import styles from './BlogIndex.module.css'

const badgeClass = { gold: 'badgeGold', green: 'badgeGreen', cyan: 'badgeCyan', purple: 'badgePurple', muted: 'badgeMuted' }

export default function BlogIndex() {
  return (
    <div className={styles.page}>
      <Topbar />
      <div className={styles.wrapper}>

        <header className={styles.header}>
          <div className={styles.headerMeta}>
            <span className={styles.headerLabel}>// technical blog</span>
          </div>
          <h1 className={styles.title}>Network Panache</h1>
          <p className={styles.subtitle}>
            Technical depth. Deliberate style. Lab walkthroughs, protocol deep dives,
            and field notes from an IT professional targeting Network & Cloud Security.
          </p>
        </header>

        <div className={styles.postList}>
          {posts.filter((post) => !post.hidden).map((post) => (
            <Link to={`/post/${post.slug}`} key={post.slug} className={styles.postCard}>
              <div className={styles.cardTop}>
                <div className={styles.badgeRow}>
                  {post.badges.map((b) => (
                    <span key={b.label} className={`${styles.badge} ${styles[badgeClass[b.color]]}`}>
                      {b.label}
                    </span>
                  ))}
                </div>
                <span className={styles.readTime}>{post.readTime}</span>
              </div>
              <h2 className={styles.cardTitle}>{post.title}</h2>
              <p className={styles.cardSubtitle}>{post.subtitle}</p>
              <div className={styles.cardFooter}>
                <span className={styles.cardDate}>{post.date}</span>
                <span className={styles.cardCta}>Read post →</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  )
}
