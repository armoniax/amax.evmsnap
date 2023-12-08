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
 * @param locale - i18n
 * @returns text array
 */
export function actionsUI(
  actions: Action[],
  locale: (key: string) => string,
): any[] {
  const arr: any[] = [];
  const isUpdateAuth =
    actions.findIndex((item) => item.name === 'updateauth') > -1;
  if (isUpdateAuth) {
    arr.push(
      text({
        value: `**${locale('updateAuthTips')}**`,
        markdown: true,
      }),
    );
    arr.push(divider());
  }
  for (const action of actions) {
    for (const key in action) {
      if (key === 'data') {
        arr.push(
          text({
            value: `${key}: ${
              isObj(action[key]) ? JSON.stringify(action[key]) : action[key]
            }`,
            markdown: false,
          }),
        );
      } else if (key === 'authorization') {
        arr.push(
          text({
            value: `${key}: ${JSON.stringify(action[key])}`,
            markdown: false,
          }),
        );
      } else {
        arr.push(
          text({
            value: `${key}: ${(action as { [key: string]: any })[key]}`,
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
