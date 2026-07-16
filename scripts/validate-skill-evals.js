#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_ROOT = path.resolve(__dirname, '..');
const COVERAGE_MANIFEST = 'scripts/data/skill-eval-coverage.json';

function compareText(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function formatLabel(skillName) {
  return `skills/${skillName}/evals/evals.json`;
}

function readCoverageManifest(root, errors) {
  const manifestPath = path.join(root, ...COVERAGE_MANIFEST.split('/'));
  if (!fs.existsSync(manifestPath)) {
    errors.push(`${COVERAGE_MANIFEST}: file is missing`);
    return new Set();
  }
  if (!fs.statSync(manifestPath).isFile()) {
    errors.push(`${COVERAGE_MANIFEST}: path must be a regular file`);
    return new Set();
  }

  let document;
  try {
    const source = fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, '');
    document = JSON.parse(source);
  } catch (error) {
    errors.push(`${COVERAGE_MANIFEST}: invalid JSON`);
    return new Set();
  }

  if (!isPlainObject(document)) {
    errors.push(`${COVERAGE_MANIFEST}: root must be a JSON object`);
    return new Set();
  }
  if (document.schema_version !== 1) {
    errors.push(`${COVERAGE_MANIFEST}: schema_version must be 1`);
  }
  if (!Array.isArray(document.required_skills) || document.required_skills.length === 0) {
    errors.push(`${COVERAGE_MANIFEST}: required_skills must be a non-empty array`);
    return new Set();
  }

  const requiredSkills = new Set();
  let previousName = null;
  for (let index = 0; index < document.required_skills.length; index += 1) {
    const value = document.required_skills[index];
    const field = `required_skills[${index}]`;
    if (!isNonEmptyString(value)) {
      errors.push(`${COVERAGE_MANIFEST}: ${field} must be a non-empty string`);
      continue;
    }

    const skillName = value.trim();
    if (skillName !== value || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skillName)) {
      errors.push(`${COVERAGE_MANIFEST}: ${field} must be a normalized kebab-case Skill name`);
      continue;
    }
    if (requiredSkills.has(skillName)) {
      errors.push(`${COVERAGE_MANIFEST}: duplicate required Skill: ${skillName}`);
      continue;
    }
    if (previousName !== null && compareText(previousName, skillName) >= 0) {
      errors.push(`${COVERAGE_MANIFEST}: required_skills must be sorted in ascending order`);
    }
    requiredSkills.add(skillName);
    previousName = skillName;
  }

  return requiredSkills;
}

function validateInputFile(skillDir, skillRealDir, value, label, evalIndex, fileIndex, errors) {
  const field = `evals[${evalIndex}].files[${fileIndex}]`;
  if (!isNonEmptyString(value)) {
    errors.push(`${label}: ${field} must be a non-empty string`);
    return null;
  }

  const reference = value.trim();
  if (reference.includes('\\')) {
    errors.push(`${label}: ${field} must use forward slashes`);
    return null;
  }
  if (reference.includes('\0')) {
    errors.push(`${label}: ${field} must not contain a NUL byte`);
    return null;
  }
  if (path.posix.isAbsolute(reference) || path.win32.isAbsolute(reference)) {
    errors.push(`${label}: ${field} must be relative to the Skill directory`);
    return null;
  }

  const segments = reference.split('/');
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    errors.push(`${label}: ${field} must be a normalized relative path without traversal segments`);
    return null;
  }

  const candidate = path.resolve(skillDir, ...segments);
  if (!isWithin(skillDir, candidate)) {
    errors.push(`${label}: ${field} escapes the Skill directory`);
    return null;
  }
  if (!fs.existsSync(candidate)) {
    errors.push(`${label}: ${field} does not exist: ${reference}`);
    return reference;
  }

  let candidateRealPath;
  try {
    candidateRealPath = fs.realpathSync(candidate);
  } catch (error) {
    errors.push(`${label}: ${field} cannot be resolved: ${reference}`);
    return reference;
  }
  if (!isWithin(skillRealDir, candidateRealPath)) {
    errors.push(`${label}: ${field} resolves outside the Skill directory`);
    return reference;
  }
  if (!fs.statSync(candidate).isFile()) {
    errors.push(`${label}: ${field} must reference a regular file: ${reference}`);
  }
  return reference;
}

function validateEvalDocument(skillName, skillDir, document, errors) {
  const label = formatLabel(skillName);
  const summary = { evalCount: 0, assertionCount: 0 };
  if (!isPlainObject(document)) {
    errors.push(`${label}: root must be a JSON object`);
    return summary;
  }

  if (!isNonEmptyString(document.skill_name)) {
    errors.push(`${label}: skill_name must be a non-empty string`);
  } else if (document.skill_name.trim() !== skillName) {
    errors.push(`${label}: skill_name must match the Skill directory (${skillName})`);
  }

  if (!Array.isArray(document.evals) || document.evals.length === 0) {
    errors.push(`${label}: evals must be a non-empty array`);
    return summary;
  }

  let skillRealDir;
  try {
    skillRealDir = fs.realpathSync(skillDir);
  } catch (error) {
    errors.push(`${label}: Skill directory cannot be resolved`);
    return summary;
  }

  const ids = new Set();
  for (let evalIndex = 0; evalIndex < document.evals.length; evalIndex += 1) {
    const evaluation = document.evals[evalIndex];
    summary.evalCount += 1;
    if (!isPlainObject(evaluation)) {
      errors.push(`${label}: evals[${evalIndex}] must be an object`);
      continue;
    }

    if (!Number.isInteger(evaluation.id) || evaluation.id < 1) {
      errors.push(`${label}: evals[${evalIndex}].id must be a positive integer`);
    } else if (ids.has(evaluation.id)) {
      errors.push(`${label}: duplicate eval id: ${evaluation.id}`);
    } else {
      ids.add(evaluation.id);
    }

    if (!isNonEmptyString(evaluation.prompt)) {
      errors.push(`${label}: evals[${evalIndex}].prompt must be a non-empty string`);
    }
    if (!isNonEmptyString(evaluation.expected_output)) {
      errors.push(`${label}: evals[${evalIndex}].expected_output must be a non-empty string`);
    }

    if (!Array.isArray(evaluation.assertions) || evaluation.assertions.length === 0) {
      errors.push(`${label}: evals[${evalIndex}].assertions must be a non-empty array`);
    } else {
      const assertions = new Set();
      for (let assertionIndex = 0; assertionIndex < evaluation.assertions.length; assertionIndex += 1) {
        const assertion = evaluation.assertions[assertionIndex];
        if (!isNonEmptyString(assertion)) {
          errors.push(`${label}: evals[${evalIndex}].assertions[${assertionIndex}] must be a non-empty string`);
          continue;
        }
        const normalizedAssertion = assertion.trim();
        if (assertions.has(normalizedAssertion)) {
          errors.push(`${label}: evals[${evalIndex}] contains a duplicate assertion: ${normalizedAssertion}`);
          continue;
        }
        assertions.add(normalizedAssertion);
        summary.assertionCount += 1;
      }
    }

    if (evaluation.files === undefined) continue;
    if (!Array.isArray(evaluation.files)) {
      errors.push(`${label}: evals[${evalIndex}].files must be an array when declared`);
      continue;
    }

    const files = new Set();
    for (let fileIndex = 0; fileIndex < evaluation.files.length; fileIndex += 1) {
      const reference = validateInputFile(
        skillDir,
        skillRealDir,
        evaluation.files[fileIndex],
        label,
        evalIndex,
        fileIndex,
        errors
      );
      if (reference === null) continue;
      if (files.has(reference)) {
        errors.push(`${label}: evals[${evalIndex}] contains a duplicate file reference: ${reference}`);
      } else {
        files.add(reference);
      }
    }
  }

  return summary;
}

function validateRepository(root) {
  const skillsDir = path.join(root, 'skills');
  const errors = [];
  const requiredSkills = readCoverageManifest(root, errors);
  const summary = {
    totalSkills: 0,
    coveredSkills: 0,
    evalCount: 0,
    assertionCount: 0,
  };

  if (!fs.existsSync(skillsDir) || !fs.statSync(skillsDir).isDirectory()) {
    errors.push('skills directory is missing');
    return { errors, summary };
  }

  const skillEntries = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => compareText(left.name, right.name));
  const definedSkills = new Set();
  const coveredSkills = new Set();

  for (const entry of skillEntries) {
    const skillDir = path.join(skillsDir, entry.name);
    const skillFile = path.join(skillDir, 'SKILL.md');
    const evalFile = path.join(skillDir, 'evals', 'evals.json');
    const hasSkill = fs.existsSync(skillFile) && fs.statSync(skillFile).isFile();
    const hasEvals = fs.existsSync(evalFile);

    if (!hasSkill) {
      if (hasEvals) errors.push(`${formatLabel(entry.name)}: evals exist but SKILL.md is missing`);
      continue;
    }

    summary.totalSkills += 1;
    definedSkills.add(entry.name);
    if (!hasEvals) continue;
    summary.coveredSkills += 1;
    coveredSkills.add(entry.name);

    if (!fs.statSync(evalFile).isFile()) {
      errors.push(`${formatLabel(entry.name)}: path must be a regular file`);
      continue;
    }

    let document;
    try {
      const source = fs.readFileSync(evalFile, 'utf8').replace(/^\uFEFF/, '');
      document = JSON.parse(source);
    } catch (error) {
      errors.push(`${formatLabel(entry.name)}: invalid JSON`);
      continue;
    }

    const evalSummary = validateEvalDocument(entry.name, skillDir, document, errors);
    summary.evalCount += evalSummary.evalCount;
    summary.assertionCount += evalSummary.assertionCount;
  }

  for (const skillName of requiredSkills) {
    if (!definedSkills.has(skillName)) {
      errors.push(`${COVERAGE_MANIFEST}: required Skill is missing or has no SKILL.md: ${skillName}`);
    } else if (!coveredSkills.has(skillName)) {
      errors.push(`${formatLabel(skillName)}: required eval package is missing (declared in ${COVERAGE_MANIFEST})`);
    }
  }

  return { errors, summary };
}

function formatCoverage(summary) {
  const percentage = summary.totalSkills === 0
    ? '0.0'
    : ((summary.coveredSkills / summary.totalSkills) * 100).toFixed(1);
  return `${summary.coveredSkills}/${summary.totalSkills} skills covered (${percentage}%), ${summary.evalCount} evals, ${summary.assertionCount} assertions`;
}

function parseRoot(argv) {
  if (argv.length === 0) return DEFAULT_ROOT;
  if (argv.length === 2 && argv[0] === '--root' && isNonEmptyString(argv[1])) {
    return path.resolve(argv[1]);
  }
  console.error('Usage: node scripts/validate-skill-evals.js [--root <repository>]');
  process.exit(2);
}

const root = parseRoot(process.argv.slice(2));
const result = validateRepository(root);
if (result.errors.length > 0) {
  console.error('Skill eval validation failed:');
  for (const error of result.errors) console.error(`- ${error}`);
  console.error(`Coverage: ${formatCoverage(result.summary)}`);
  process.exit(1);
}

console.log(`Skill eval validation passed: ${formatCoverage(result.summary)}`);
