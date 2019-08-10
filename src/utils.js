/**
 *  @file       utils.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2018 Colin Sullivan
 *  @license    Licensed under the GPLv3 license.
 **/

/**
 *  Retrieve an environment variable by name, error if it doesn't exist.
 **/
export function getEnvOrError(envName) {
  var result = process.env[envName];

  if (result) {
    return result;
  } else {
    throw new Error(`env variable '${envName}' not defined`);
  }
}

export function getEnvAsNumber (envName) {
  var result = process.env[envName];

  if (result) {
    return Number(result);
  } else {
    return null;
  }
}

export function beatsToMs (beats, bpm) {
  return beats / bpm * 60000.0;
}

export function constrain (value, min, max) {
  return Math.max(min, Math.min(max, value));
}
