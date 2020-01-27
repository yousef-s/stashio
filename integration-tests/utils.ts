import * as fs from 'fs';
import * as path from 'path';

export const getEmojisByName = (
  name: string
): Promise<{ [x: string]: string }> => {
  // Data set from Github
  const fp = path.join(__dirname, '/data.json');
  return new Promise((resolve, reject) => {
    const data = fs.readFileSync(fp, 'utf8');
    const emojis = Object.entries(JSON.parse(data))
      .filter(([key]) => key.includes(name))
      .reduce((o, [key, value]) => ({ ...o, [key]: value }), {});

    return resolve(emojis);
  });
};

export const sleep = (s: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, s * 1000);
  });
};

export const resolverOnce = () => {
  let count = 0;
  return async () => {
    count++;
    if (count > 1) {
      return true;
    }

    return false;
  };
};

export const expectedObjectValueAir = {
  airplane:
    'https://github.githubassets.com/images/icons/emoji/unicode/2708.png?v8',
  haircut:
    'https://github.githubassets.com/images/icons/emoji/unicode/1f487.png?v8',
  haircut_man:
    'https://github.githubassets.com/images/icons/emoji/unicode/1f487-2642.png?v8',
  haircut_woman:
    'https://github.githubassets.com/images/icons/emoji/unicode/1f487.png?v8',
  person_with_blond_hair:
    'https://github.githubassets.com/images/icons/emoji/unicode/1f471.png?v8',
  pitcairn_islands:
    'https://github.githubassets.com/images/icons/emoji/unicode/1f1f5-1f1f3.png?v8',
  small_airplane:
    'https://github.githubassets.com/images/icons/emoji/unicode/1f6e9.png?v8',
  wheelchair:
    'https://github.githubassets.com/images/icons/emoji/unicode/267f.png?v8'
};

export const expectedObjectValueVideo = {
  video_camera:
    'https://github.githubassets.com/images/icons/emoji/unicode/1f4f9.png?v8',
  video_game:
    'https://github.githubassets.com/images/icons/emoji/unicode/1f3ae.png?v8'
};
