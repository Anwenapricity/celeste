# 频道外链新标签页打开 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 使三个频道外链默认在新标签页打开。

**Architecture:** 仅在 `code.html` 的三个 `.channel-link` 锚点增加标准 HTML 安全属性。

**Tech Stack:** HTML5。

## Global Constraints

- 仅修改三个频道外链。
- 每个链接使用 `target="_blank" rel="noopener noreferrer"`。
- 不改布局、样式、JavaScript 或页面内锚点链接。

---

### Task 1: 更新频道外链属性

**Files:**
- Modify: `code.html:227,237,247`

- [ ] 在抖音、哔哩哔哩和小红书的 `.channel-link` 上添加 `target="_blank" rel="noopener noreferrer"`。
- [ ] 运行 `Select-String -Path code.html -Pattern 'target="_blank" rel="noopener noreferrer"'`，预期匹配三次。
- [ ] 运行 `git diff --check`，预期无错误。
