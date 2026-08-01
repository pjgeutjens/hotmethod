import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../_site/index.html", import.meta.url), "utf8");
const graduates = JSON.parse(await readFile(new URL("../src/_data/graduates.json", import.meta.url), "utf8"));
const site = JSON.parse(await readFile(new URL("../src/_data/site.json", import.meta.url), "utf8"));
const copy = JSON.parse(await readFile(new URL("../src/_data/copy.json", import.meta.url), "utf8"));
const batches = JSON.parse(await readFile(new URL("../src/_data/batches.json", import.meta.url), "utf8"));

test("renders the definitive twelve-person Batch 1 roster", () => {
  assert.equal(graduates.length, 12);
  assert.equal(batches.length, 1);
  assert.ok(graduates.every((graduate) => graduate.batchId === batches[0].id));
  assert.equal(batches[0].dateLabel, "05–07 Jun 2026");
  assert.equal(batches[0].venue, "Union Yoga");
  assert.match(html, /05–07 Jun 2026/);
  assert.match(html, /Union Yoga · Jakarta, Indonesia/);
  for (const graduate of graduates) {
    assert.match(html, new RegExp(graduate.displayName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(html, /<dt>Graduates<\/dt><dd>12<\/dd>/);
});

test("uses only proposal-labelled graduate portraits", async () => {
  const pictured = graduates.filter((graduate) => graduate.image);
  const pending = graduates.filter((graduate) => !graduate.image);
  assert.equal(pictured.length, 11);
  assert.deepEqual(pending.map((graduate) => graduate.displayName), ["Noor Anugrahandina"]);
  assert.equal((html.match(/Portrait pending/g) || []).length, 1);
  assert.equal((html.match(/graduate-portrait heat-\d is-pending/g) || []).length, 1);
  for (const graduate of pictured) {
    assert.equal(graduate.imageSource.url, "https://nadpilatesbarre.my.canva.site/bentangbahagiaxashta-partnership");
    assert.ok(graduate.imageSource.label);
    assert.match(html, new RegExp(`alt="Portrait of ${graduate.displayName}"`));
    await readFile(new URL(`../src${graduate.image}`, import.meta.url));
  }
});

test("contains the core sister-site destinations and eboonad handoff", () => {
  for (const id of ["main", "batches"]) {
    assert.ok(html.includes(`id="${id}"`));
  }
  assert.ok(html.includes(`href="${site.eboonadUrl}"`));
  assert.ok(html.includes(`href="${site.workshopUrl}"`));
});

test("keeps local asset URLs path-prefix aware", () => {
  assert.match(html, /href="\/public\/favicon\.svg"/);
  assert.match(html, /href="\/styles\.css"/);
  assert.match(html, /src="\/script\.js"/);
});

test("uses the source-matched flame in both wordmark positions", () => {
  assert.equal((html.match(/class="brand-flame"/g) || []).length, 4);
  assert.equal((html.match(/<svg viewBox="0 0 24 24"/g) || []).length, 4);
  assert.doesNotMatch(html, /◊/);
});

test("renders only source-mapped roster and handoff copy", () => {
  for (const section of [copy.hero, copy.batches, copy.handoff]) {
    assert.match(section.source, /^(https:\/\/|user-direction:)/);
  }
  for (const phrase of [
    ...copy.hero.titleLines,
    copy.handoff.title,
    copy.handoff.body
  ]) {
    assert.ok(html.includes(phrase.replaceAll("&", "&amp;")));
  }
  for (const unsupportedDraft of ["Built in", "Strength with intent", "Ground the room", "Learning. Moving. Leading.", "Created by", "3-Day Intensive Workshop"]) {
    assert.ok(!html.includes(unsupportedDraft));
  }
});

test("uses a future-ready batch model", () => {
  assert.equal(new Set(batches.map((batch) => batch.id)).size, batches.length);
  for (const batch of batches) {
    assert.equal(graduates.filter((graduate) => graduate.batchId === batch.id).length, batch.graduateCount);
  }
});

test("does not imply a graduate ranking or certification order", () => {
  assert.ok(graduates.every((graduate) => !("number" in graduate)));
  assert.doesNotMatch(html, /graduate-name[^>]*>\s*<span>/);
});

test("renders every batch alphabetically by public display name", () => {
  for (const batch of batches) {
    const expected = graduates
      .filter((graduate) => graduate.batchId === batch.id)
      .map((graduate) => graduate.displayName)
      .sort((left, right) => left.localeCompare(right, "en", { sensitivity: "base" }));
    const positions = expected.map((name) => html.indexOf(`>${name}</h3>`));
    assert.ok(positions.every((position) => position >= 0));
    assert.deepEqual(positions, [...positions].sort((left, right) => left - right));
  }
});

test("uses locally generated media references", async () => {
  const localRefs = [...html.matchAll(/(?:src|href)="(\/(?:public\/[^"?#]+|styles\.css|script\.js))"/g)].map((match) => match[1]);
  assert.ok(localRefs.length >= 4);
  for (const ref of localRefs) {
    const file = new URL(`../_site${ref}`, import.meta.url);
    await readFile(file);
  }
});

test("ships the Meridian-derived campaign tokens", async () => {
  const css = await readFile(new URL("../_site/styles.css", import.meta.url), "utf8");
  for (const token of ["--campaign-ink", "--campaign-espresso", "--campaign-clay", "--brand-flame", "--campaign-taupe", "--campaign-parchment"]) {
    assert.ok(css.includes(token));
  }
});

test("uses the brighter source-matched flame favicon", async () => {
  const favicon = await readFile(new URL("../src/public/favicon.svg", import.meta.url), "utf8");
  assert.match(favicon, /stroke="#a45f45"/);
  assert.match(favicon, /M12 10\.941c2\.333-3\.308/);
  assert.doesNotMatch(favicon, /fill="#855440"/);
});

test("reserves hairlines for major boundaries", async () => {
  const css = await readFile(new URL("../_site/styles.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /\.hero-count\s*\{[^}]*border-/s);
  assert.doesNotMatch(css, /\.batch-meta(?:\s+div)?\s*\{[^}]*border-/s);
  assert.doesNotMatch(css, /\.graduate-name\s*\{[^}]*border-/s);
  assert.match(css, /\.graduates\s*\{[^}]*border-top:/s);
});

test("does not emit accidental template syntax", () => {
  assert.doesNotMatch(html, /\{\{|\{%|undefined|null/);
});

test("project output is generated separately", async () => {
  const files = await readdir(new URL("../_site/", import.meta.url));
  assert.ok(files.includes("index.html"));
  assert.ok(files.includes("styles.css"));
  assert.ok(files.includes("public"));
});
