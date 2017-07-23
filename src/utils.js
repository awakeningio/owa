/**
 *  @file       utils.js
 *
 *
 *  @author     Colin Sullivan <colin [at] colin-sullivan.net>
 *
 *  @copyright  2017 Colin Sullivan
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
