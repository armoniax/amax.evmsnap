/* eslint-disable jsdoc/match-description */
import { heading, panel, text } from '@metamask/snaps-ui';

/**
 * confirm
 *
 * @param settings - confirm settings
 * @param settings.title - heading
 * @param settings.texts - text
 * @returns The result of `snap_dialog`.
 */
export default async function confirm(settings: {
  title?: string;
  texts: string[];
}): Promise<string | boolean | null> {
  const arr: any[] = settings.texts.map((str) => text(str));
  if (settings.title) {
    arr.unshift(heading(settings.title));
  }
  return await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel(arr),
    },
  });
}
