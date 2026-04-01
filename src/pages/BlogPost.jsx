import { useParams, Link, Navigate } from 'react-router-dom'
import Topbar from '../components/Topbar'
import { getPost } from '../data/posts'
import styles from './BlogPost.module.css'

const badgeClass = { gold: 'badgeGold', green: 'badgeGreen', cyan: 'badgeCyan', purple: 'badgePurple', muted: 'badgeMuted' }
const calloutClass = { info: 'calloutInfo', warn: 'calloutWarn', danger: 'calloutDanger', success: 'calloutSuccess' }
const calloutIcon  = { info: 'ℹ', warn: '⚠', danger: '✕', success: '✓' }
const calloutHeadingClass = { info: 'headingCyan', warn: 'headingGold', danger: 'headingRed', success: 'headingGreen' }

function RenderContent({ blocks }) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case 'p':
        return <p key={i} className={styles.p}>{block.text}</p>

      case 'h3':
        return <h3 key={i} className={styles.h3}>{block.text}</h3>

      case 'callout':
        return (
          <div key={i} className={`${styles.callout} ${styles[calloutClass[block.variant]]}`}>
            <span className={styles.calloutIcon}>{calloutIcon[block.variant]}</span>
            <div>
              <strong className={`${styles.calloutHeading} ${styles[calloutHeadingClass[block.variant]]}`}>
                {block.heading}
              </strong>
              {block.text}
            </div>
          </div>
        )

      case 'code':
        return (
          <div key={i} className={styles.codeBlock}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLang}>{block.lang}</span>
              <button
                className={styles.codeCopy}
                onClick={() => navigator.clipboard.writeText(block.text)}
              >Copy</button>
            </div>
            <pre><code>{block.text}</code></pre>
          </div>
        )

      case 'terminal':
        return (
          <div key={i} className={styles.terminal}>
            <div className={styles.terminalBar}>
              <span className={`${styles.dot} ${styles.dotRed}`}></span>
              <span className={`${styles.dot} ${styles.dotYellow}`}></span>
              <span className={`${styles.dot} ${styles.dotGreen}`}></span>
              <span className={styles.terminalLabel}>bash</span>
            </div>
            <pre>
              {block.lines.map((line, j) => (
                <span key={j} className={styles[line.type === 'prompt' ? 'termPrompt' : 'termOut']}>
                  {line.text}{'\n'}
                </span>
              ))}
            </pre>
          </div>
        )

      case 'table':
        return (
          <div key={i} className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>{block.headers.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {block.rows.map((row, r) => (
                  <tr key={r}>{row.map((cell, c) => <td key={c}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        )

      default:
        return null
    }
  })
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)
  if (!post) return <Navigate to="/" replace />

  return (
    <div className={styles.page}>
      <Topbar />
      <div className={styles.wrapper}>

        {/* HEADER */}
        <div className={styles.postHeader}>
          <div className={styles.repoBar}>
            <span className={`${styles.dot} ${styles.dotRed}`}></span>
            <span className={`${styles.dot} ${styles.dotYellow}`}></span>
            <span className={`${styles.dot} ${styles.dotGreen}`}></span>
            <span className={styles.repoPath}>
              blog.lavoisier.dev / <span>{slug}.md</span>
            </span>
          </div>
          <div className={styles.headerBody}>
            <div className={styles.badgeRow}>
              {post.badges.map((b) => (
                <span key={b.label} className={`${styles.badge} ${styles[badgeClass[b.color]]}`}>
                  {b.label}
                </span>
              ))}
              <span className={`${styles.badge} ${styles.badgeMuted}`}>{post.readTime}</span>
            </div>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <p className={styles.postSubtitle}>{post.subtitle}</p>
            <div className={styles.postMeta}>
              <div className={styles.metaItem}><span className={styles.metaLabel}>Author</span><span className={styles.metaValue}>Lavoisier Cornerstone</span></div>
              <div className={styles.metaItem}><span className={styles.metaLabel}>Published</span><span className={styles.metaValue}>{post.date}</span></div>
              <div className={styles.metaItem}><span className={styles.metaLabel}>Category</span><span className={styles.metaValue}>{post.category}</span></div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Difficulty</span>
                <span className={`${styles.metaValue} ${styles[`diff${post.difficultyColor}`]}`}>{post.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TOC */}
        <div className={styles.toc}>
          <div className={styles.tocTitle}>▸ Contents</div>
          <ol className={styles.tocList}>
            {post.sections.map((s) => (
              <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
            ))}
          </ol>
        </div>

        {/* SECTIONS */}
        <div className={styles.postBody}>
          {post.sections.map((section, idx) => (
            <div key={section.id}>
              <div className={styles.section} id={section.id}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionNumber}>{section.number}</span>
                  <h2 className={styles.h2}>{section.title}</h2>
                </div>
                <RenderContent blocks={section.content} />
              </div>
              {idx < post.sections.length - 1 && (
                <div className={styles.divider}>
                  <span>{post.sections[idx + 1]?.title.toLowerCase().split(':')[0]}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className={styles.postFooter}>
          <div className={styles.authorBlock}>
            <div className={styles.avatar}>LC</div>
            <div>
              <div className={styles.authorName}>Lavoisier Cornerstone</div>
              <div className={styles.authorRole}>Network Security · CCNA Candidate · CompTIA Security+</div>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <a href="https://github.com/cornerstonian" className={styles.footerLink}>↗ GitHub</a>
            <Link to="/" className={styles.footerLink}>← All Posts</Link>
            <a href="https://lavoisier.dev" className={styles.footerLink}>lavoisier.dev</a>
          </div>
        </div>

      </div>
    </div>
  )
}
