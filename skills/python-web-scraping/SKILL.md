---
name: python-web-scraping
description: Python web scraping and HTML extraction guide covering requests/httpx, HTML parsing, pagination, normalization, retries, and polite crawling of static or lightly dynamic sites. Use when collecting data from web pages, feeds, or HTML documents, and when the task is extraction rather than browser UI testing or general Python architecture.
source: HsinPu/Autoverse-Ai-Agent-Skills
license: Apache-2.0
---

# Python Web Scraping

Use this skill when the goal is to extract structured data from web pages, feeds, or HTML documents.

## When To Use

- Collect data from article listings, directories, product pages, or feeds
- Build scrapers or crawlers with pagination and deduplication
- Parse HTML into structured records
- Handle retries, timeouts, headers, sessions, and rate limits
- Work with lightly dynamic sites that still expose usable HTML or JSON

## Boundaries

- Use `webapp-testing` when you must click, log in, or render JS-heavy pages in a browser.
- Use `python-data-engineering` for downstream cleaning, joins, aggregation, or dataset pipelines.
- Use `python-development` for general Python architecture, packaging, or code style.

## Workflow

1. Check for an API, feed, or export before scraping HTML.
2. Inspect the page source and identify stable data locations.
3. Use a session, explicit timeout, and a small retry policy.
4. Extract the smallest stable payload possible.
5. Normalize URLs, whitespace, dates, and missing values.
6. Deduplicate by canonical ID or stable URL.
7. Save reproducible outputs and document scrape assumptions.

## Extraction Rules

- Prefer semantic selectors over brittle full-path CSS chains.
- Use `lxml` or XPath when selectors must be precise.
- Use BeautifulSoup when simple HTML parsing is enough.
- Resolve relative links with `urljoin`.
- Keep parsing pure and separate from fetching.

## Politeness and Safety

- Respect site terms, auth boundaries, and rate limits.
- Do not bypass access controls, captchas, or paywalls.
- Use conservative concurrency.
- Back off on `429`, `403`, and transient network errors.
- Cache fetches when repeated requests are expected.

## Handoff

- For tabular output, hand off to `python-data-engineering`.
- For browser-driven extraction, hand off to `webapp-testing`.
- For general Python packaging or style, hand off to `python-development`.

- See [reference/scraping-workflows.md](reference/scraping-workflows.md) for deeper guidance.
