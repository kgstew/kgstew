/**
 * Wrap each `h2` and the elements following it in a `<section>`.
 *
 * MDX emits a flat sequence — h2, p, p, h2, p — which cannot be laid out as
 * "label in the margin, prose in the column" with CSS alone. A flat grid places
 * the second heading beside the previous paragraph instead of below it, and the
 * float and negative-margin approaches both break as soon as a paragraph wraps
 * past the label's single line.
 *
 * Grouping into sections makes each one a grid of its own, which is both the
 * layout the design needs and better markup than it replaces.
 */
export default function rehypeSections() {
  return (tree) => {
    const out = []
    let current = null

    for (const node of tree.children) {
      const isHeading = node.type === 'element' && node.tagName === 'h2'

      if (isHeading) {
        current = {
          type: 'element',
          tagName: 'section',
          properties: { className: ['sec'] },
          children: [node],
        }
        out.push(current)
        continue
      }

      // Whitespace between blocks belongs to whichever side it lands on; keeping
      // it out of sections avoids stray text nodes becoming grid items.
      if (node.type === 'text' && !node.value.trim()) {
        ;(current ? current.children : out).push(node)
        continue
      }

      if (current) current.children.push(node)
      else out.push(node)
    }

    tree.children = out
  }
}
