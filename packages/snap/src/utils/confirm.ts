/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable jsdoc/match-description */
import { NodeType, divider, heading, panel, text } from '@metamask/snaps-ui';

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
  texts: (
    | Omit<
        {
          value: string;
          type: NodeType.Text;
          markdown?: boolean | undefined;
        },
        'type'
      >
    | string
  )[];
}): Promise<string | boolean | null> {
  const arr: any[] = settings.texts.map((value) => {
    if (value === 'divider') {
      return divider();
    }
    // @ts-ignore
    return text(value);
  });
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
