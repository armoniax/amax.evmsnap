/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable padding-line-between-statements */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsdoc/match-description */

import { Action } from '@amax/amaxjs-v2/dist/eosjs-serialize';
import { divider, text } from '@metamask/snaps-ui';

export const isObj = (str: any): boolean => typeof str === 'object';

export const isArr = (str: any): boolean =>
  Object.prototype.toString.call(str) === '[object Array]';

/**
 * action object to action ui;
 *
 * @param actions - action array
 * @returns text array
 */
export function actionsUI(actions: Action[]): any[] {
  const arr: any[] = [];
  for (const action of actions) {
    for (const key in action) {
      if (key === 'data') {
        for (const key1 in action[key]) {
          const item = action[key][key1];
          arr.push(
            text({
              value: `${key1}: ${
                isObj(item) ? JSON.stringify(action[key][key1]) : item
              }`,
              markdown: false,
            }),
          );
        }
      } else if (key === 'authorization') {
        arr.push(
          text({
            value: `${key}: ${JSON.stringify(action[key])}`,
            markdown: false,
          }),
        );
      }
    }
    arr.push(divider());
  }
  // del last divider
  return arr.slice(0, -1);
}
