const OPEN_CLASS = 'is-open'

function setOpen(section, open) {
  section.classList.toggle(OPEN_CLASS, open)
  const button = section.querySelector('.kr-section__toggle')
  const panel = section.querySelector('.kr-section__panel')
  button?.setAttribute('aria-expanded', open ? 'true' : 'false')
  if (panel) panel.inert = !open
}

function openForId(id) {
  if (!id) return
  let target = null
  try {
    target = document.getElementById(decodeURIComponent(id))
  } catch {
    return
  }
  const section = target?.closest('.kr-section')
  if (section) setOpen(section, true)
}

function hashId() {
  return location.hash.startsWith('#') ? location.hash.slice(1) : ''
}

/**
 * 把正文里的二级标题收成可展开的节。只在带 section-accordion 的页面上跑。
 * 目录点到某一节时先展开，再交给原来的滚动。
 */
export function mountSectionAccordion() {
  const doc = document.querySelector('.section-accordion .vp-doc')
  if (!doc || doc.querySelector('.kr-section')) return

  const root = [...doc.children].find((node) => node.querySelector(':scope > h2')) || doc
  const headings = [...root.querySelectorAll(':scope > h2')]
  if (!headings.length) return

  const current = safeId(hashId())
  headings.forEach((heading, index) => {
    const section = document.createElement('section')
    section.className = 'kr-section'
    const panel = document.createElement('div')
    panel.className = 'kr-section__panel'
    const inner = document.createElement('div')
    inner.className = 'kr-section__inner'
    const nextHeading = headings[index + 1]
    const nodes = []
    let sibling = heading.nextSibling
    while (sibling && sibling !== nextHeading) {
      nodes.push(sibling)
      sibling = sibling.nextSibling
    }

    heading.querySelector('.header-anchor')?.remove()
    const label = heading.textContent.trim()
    heading.textContent = ''
    if (!heading.id) heading.id = `kr-section-${index + 1}`

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'kr-section__toggle'
    button.id = `${heading.id}-toggle`
    panel.id = `${heading.id}-panel`
    button.setAttribute('aria-controls', panel.id)
    button.append(label)
    const chevron = document.createElement('span')
    chevron.className = 'kr-section__chevron'
    chevron.setAttribute('aria-hidden', 'true')
    button.append(chevron)
    heading.append(button)

    panel.setAttribute('role', 'region')
    panel.setAttribute('aria-labelledby', button.id)
    nodes.forEach((node) => inner.append(node))
    panel.append(inner)

    heading.before(section)
    section.append(heading, panel)

    const open = current ? current === heading.id || section.contains(document.getElementById(safeId(current))) : index === 0
    setOpen(section, open)
    button.addEventListener('click', () => {
      setOpen(section, !section.classList.contains(OPEN_CLASS))
    })
  })
}

function safeId(id) {
  try {
    return decodeURIComponent(id)
  } catch {
    return id
  }
}

let hashBound = false

export function bindSectionAccordionLinks() {
  if (hashBound) return
  hashBound = true
  document.addEventListener(
    'click',
    (event) => {
      const link = event.target instanceof Element ? event.target.closest('.outline-link') : null
      if (!link) return
      const href = link.getAttribute('href') || ''
      const id = href.split('#')[1]
      if (id) openForId(safeId(id))
    },
    true
  )
  window.addEventListener('hashchange', () => openForId(safeId(hashId())))
}
