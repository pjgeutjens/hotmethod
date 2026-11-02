import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../_site/index.html", import.meta.url), "utf8");
const graduates = JSON.parse(await readFile(new URL("../src/_data/graduates.json", import.meta.url), "utf8"));
const site = JSON.parse(await readFile(new URL("../src/_data/site.json", import.meta.url), "utf8"));
const copy = JSON.parse(await readFile(new URL("../src/_data/copy.json", import.meta.url), "utf8"));
const batches = JSON.parse(await readFile(new URL("../src/_data/batches.json", import.meta.url), "utf8"));

const participants = JSON.parse(await readFile(new URL("../src/_data/participants.json", import.meta.url), "utf8"));

test("renders the definitive thirteen-person Batch 1 roster", () => {
  assert.equal(graduates.filter((person) => person.batchId === "batch-01").length, 7);
  assert.equal(batches.length, 2);
  assert.ok(graduates.every((graduate) => batches.some((batch) => batch.id === graduate.batchId)));
  assert.equal(batches[0].dateLabel, "05–07 Jun 2026");
  assert.equal(batches[0].venue, "Union Yoga");
  assert.match(html, /05–07 Jun 2026/);
  assert.match(html, /Union Yoga · Jakarta, Indonesia/);
  for (const graduate of graduates) {
    assert.match(html, new RegExp(graduate.displayName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(html, /<dt>Graduates<\/dt><dd>7<\/dd>/);
});

test("uses only source-mapped graduate portraits", async () => {
  const pictured = [...graduates, ...participants].filter((graduate) => graduate.image);
  const pending = graduates.filter((graduate) => !graduate.image);
  const noor = graduates.find((graduate) => graduate.displayName === "Noor Anugrahandina");
  const pebetsi = graduates.find((graduate) => graduate.displayName === "Pebetsi Charnley");
  assert.equal(pictured.length, 32);
  assert.equal(pending.length, 0);
  assert.equal((html.match(/Portrait pending/g) || []).length, 0);
  assert.equal((html.match(/graduate-portrait heat-\d is-pending/g) || []).length, 0);
  assert.equal(noor.imageSource.url, "user-provided:google-photos/IMG_4650.jpg");
  assert.match(noor.imageSource.label, /owner-confirmed 2 Aug 2026/);
  assert.match(pebetsi.imageSource.url, /^user-provided:whatsapp\//);
  assert.match(pebetsi.imageSource.label, /owner-confirmed 6 Aug 2026/);
  for (const graduate of pictured.filter((graduate) => graduate.batchId === "batch-01" && graduate !== noor && graduate !== pebetsi)) {
    assert.equal(graduate.imageSource.url, "https://nadpilatesbarre.my.canva.site/bentangbahagiaxashta-partnership");
  }
  for (const graduate of pictured) {
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

test("Batch 1 preserves the confirmed graduation order without inventing a date", () => {
  const batch1 = html.split('aria-labelledby="batch-01-title">')[1].split('</section>')[0];
  const [graduateMarkup, participantMarkup] = batch1.split('<h3 class="roster-group-title">Participants</h3>');
  const names = markup => [...markup.matchAll(/<h4>([^<]+)<\/h4>/g)].map(match => match[1]);
  assert.deepEqual(names(graduateMarkup), ["Jane Haryono", "Pebetsi Charnley", "Jessica Januarty", "Masayu Putri", "Noor Anugrahandina", "Kay Putri", "Aisha Kirana"]);
  assert.deepEqual(names(participantMarkup), ["Angie Ayu Natasha", "Cindy Wowor", "Cut Amalia Andarini", "Katya Aiko Kusuma", "Senny Desiana Medita", "Stefani Wibowo"]);
  assert.match(batch1, /Janeley Haryono/);
  assert.match(batch1, /Pebetsi Makgalemele/);
  assert.equal(graduates.find(person => person.displayName === "Pebetsi Charnley").graduationDate, null);
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

test("production discovery files use the canonical Hot Method hostname", async () => {
  const [robots, sitemap] = await Promise.all([
    readFile(new URL("../_site/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../_site/sitemap.xml", import.meta.url), "utf8")
  ]);
  assert.match(html, /<link rel="canonical" href="https:\/\/hotmethod\.eboonad\.com\/">/);
  assert.doesNotMatch(html, /name="robots" content="noindex/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/hotmethod\.eboonad\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/hotmethod\.eboonad\.com\/<\/loc>/);
});

test("Batch 2 orders graduates by graduation date and participants alphabetically", () => {
  const batch2 = html.slice(html.indexOf('<section class="graduates section" aria-labelledby="batch-02-title">'));
  const groups = batch2.split('<h3 class="roster-group-title">Participants</h3>');
  assert.equal(groups.length, 2);
  const confirmed = graduates.filter(person => person.batchId === "batch-02");
  assert.deepEqual(confirmed.map(person => person.displayName), ["Emi Endrawati", "Mutiara Chairunnisa", "Nanies Nuraini Herdirina"]);
  assert.equal(participants.filter(person => person.batchId === "batch-02").length, 16);
  assert.ok(participants.some(person => person.displayName === "Franita Yulianty"));
  for (const [people, markup] of [[confirmed, groups[0]], [participants.filter(person => person.batchId === "batch-02"), groups[1]]]) {
    const expected = people === confirmed
      ? ["Nanies Nuraini Herdirina", "Emi Endrawati", "Mutiara Chairunnisa"]
      : people.map(person => person.displayName).sort((a,b) => a.localeCompare(b, "en", { sensitivity: "base" }));
    const actual = [...markup.matchAll(/<h4>([^<]+)<\/h4>/g)].map(match => match[1]);
    assert.deepEqual(actual, expected);
    assert.ok(people.every(person => person.image && person.imageSource.url === "user-provided:Batch 2-20261102T093641Z-1-001.zip"));
  }
  assert.doesNotMatch(html, /remedial|certificate received|8-Oct-2026|25-Sep-2026/i);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test("Batch 2 portraits have unique source mappings and 4:5 crop records", async () => {
  const crops = JSON.parse(await readFile(new URL("../docs/batch-02-portrait-crops.json", import.meta.url), "utf8"));
  assert.equal(crops.length, 19);
  assert.equal(new Set(crops.map(crop => crop.output)).size, 19);
  for (const person of [...graduates, ...participants].filter(person => person.batchId === "batch-02")) {
    const crop = crops.find(crop => crop.displayName === person.displayName);
    assert.equal(crop.output, person.image);
    assert.equal(crop.source, person.imageSource.label);
    assert.ok(Math.abs(crop.crop.height / crop.crop.width - 1.25) < 0.002);
    await readFile(new URL(`../src${person.image}`, import.meta.url));
  }
});
