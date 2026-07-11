/// <reference types="node" />

import {createHash as createCryptoHash} from 'crypto';

export type MergeResults = {
  contents: string;
  didClear: boolean;
  didMerge: boolean;
};

type MergeOptions = {
  src: string;
  newSrc: string;
  tag: string;
  anchor: string | RegExp;
  offset: number;
  comment: string;
};

/*!
 * Compatible subset of Expo's generateCode utility. Keeping it local avoids
 * private @expo/config-plugins subpath imports while supporting Expo versions
 * that don't expose CodeGenerator from the root.
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const getGeneratedSectionIndexes = (src: string, tag: string) => {
  const contents = src.split('\n');
  const start = contents.findIndex(line =>
    new RegExp(`@generated begin ${tag} -`).test(line),
  );
  const end = contents.findIndex(line =>
    new RegExp(`@generated end ${tag}$`).test(line),
  );

  return {contents, start, end};
};

const removeGeneratedContents = (src: string, tag: string): string | null => {
  const {contents, start, end} = getGeneratedSectionIndexes(src, tag);

  if (start > -1 && end > -1 && start < end) {
    contents.splice(start, end - start + 1);
    return contents.join('\n');
  }

  return null;
};

const createGeneratedHeaderComment = (
  contents: string,
  tag: string,
  comment: string,
) => {
  const hash = createCryptoHash('sha1').update(contents).digest('hex');
  return `${comment} @generated begin ${tag} - expo prebuild (DO NOT MODIFY) sync-${hash}`;
};

const addLines = (
  content: string,
  find: string | RegExp,
  offset: number,
  toAdd: string[],
) => {
  const lines = content.split('\n');
  let lineIndex = lines.findIndex(line => line.match(find));

  if (lineIndex < 0) {
    const error = new Error(
      `Failed to match "${find}" in contents:\n${content}`,
    ) as Error & {code: string};
    error.code = 'ERR_NO_MATCH';
    throw error;
  }

  for (const newLine of toAdd) {
    lines.splice(lineIndex + offset, 0, newLine);
    lineIndex++;
  }

  return lines.join('\n');
};

export const mergeContents = ({
  src,
  newSrc,
  tag,
  anchor,
  offset,
  comment,
}: MergeOptions): MergeResults => {
  const header = createGeneratedHeaderComment(newSrc, tag, comment);

  if (!src.includes(header)) {
    const sanitizedTarget = removeGeneratedContents(src, tag);
    return {
      contents: addLines(sanitizedTarget ?? src, anchor, offset, [
        header,
        ...newSrc.split('\n'),
        `${comment} @generated end ${tag}`,
      ]),
      didMerge: true,
      didClear: !!sanitizedTarget,
    };
  }

  return {contents: src, didClear: false, didMerge: false};
};

export const removeContents = ({
  src,
  tag,
}: {
  src: string;
  tag: string;
}): MergeResults => {
  const sanitizedTarget = removeGeneratedContents(src, tag);
  return {
    contents: sanitizedTarget ?? src,
    didMerge: false,
    didClear: !!sanitizedTarget,
  };
};
