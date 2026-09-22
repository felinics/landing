// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { parseUnifiedDiffRows } from './useShikiHighlighter'

describe('parseUnifiedDiffRows', () => {
  it('renders context, removal, and addition rows with their gutter line numbers', () => {
    const rows = parseUnifiedDiffRows(
      '--- a/f.md\n+++ b/f.md\n@@ -10,3 +10,3 @@\n keep\n-old\n+new\n tail\n',
    )
    expect(rows).toEqual([
      { kind: 'context', lineNumber: 10, text: 'keep' },
      { kind: 'remove', lineNumber: 11, text: 'old' },
      { kind: 'add', lineNumber: 11, text: 'new' },
      { kind: 'context', lineNumber: 12, text: 'tail' },
    ])
  })

  it('renders a new-file diff as all additions', () => {
    const rows = parseUnifiedDiffRows(
      '--- /dev/null\n+++ b/new.md\n@@ -0,0 +1,3 @@\n+# Title\n+\n+- item\n',
    )
    expect(rows.map((row) => row.kind)).toEqual(['add', 'add', 'add'])
    expect(rows.map((row) => row.lineNumber)).toEqual([1, 2, 3])
  })

  it('does not eat hunk content lines that start with -- or ++', () => {
    // Removing a "-- comment" line produces "--- comment" in the hunk, which
    // looks exactly like the --- file header. Skipping it would both drop the
    // row and leave the counters one line behind for the rest of the hunk.
    const rows = parseUnifiedDiffRows(
      '--- a/f.sql\n+++ b/f.sql\n@@ -1,4 +1,4 @@\n select 1\n--- old comment\n+++ new comment\n tail\n',
    )
    expect(rows).toEqual([
      { kind: 'context', lineNumber: 1, text: 'select 1' },
      { kind: 'remove', lineNumber: 2, text: '-- old comment' },
      { kind: 'add', lineNumber: 2, text: '++ new comment' },
      { kind: 'context', lineNumber: 3, text: 'tail' },
    ])
  })

  it('keeps counting lines after a bare ---/+++ content row', () => {
    // Content "---"/"+++" (no trailing space, e.g. a markdown rule) must not
    // be mistaken for a header either — headers only exist before the first @@.
    const rows = parseUnifiedDiffRows(
      '--- a/f.md\n+++ b/f.md\n@@ -1,3 +1,3 @@\n----\n text\n++++\n',
    )
    expect(rows.map((row) => row.kind)).toEqual(['remove', 'context', 'add'])
    expect(rows[0]?.text).toBe('---')
    expect(rows[2]?.text).toBe('+++')
  })
})
