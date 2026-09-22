import {mergeContents, removeContents} from '../plugin/src/generateCode';

const SOURCE = ['before', 'anchor', 'after'].join('\n');

describe('generateCode', () => {
  it('inserts a tagged generated section at the anchor', () => {
    const result = mergeContents({
      src: SOURCE,
      newSrc: 'generated line',
      tag: 'test-tag',
      anchor: /anchor/,
      offset: 1,
      comment: '//',
    });

    expect(result).toMatchObject({didClear: false, didMerge: true});
    expect(result.contents).toMatch(
      /anchor\n\/\/ @generated begin test-tag - expo prebuild \(DO NOT MODIFY\) sync-[a-f0-9]{40}\ngenerated line\n\/\/ @generated end test-tag\nafter/,
    );
  });

  it('does not duplicate an unchanged generated section', () => {
    const first = mergeContents({
      src: SOURCE,
      newSrc: 'generated line',
      tag: 'test-tag',
      anchor: /anchor/,
      offset: 1,
      comment: '//',
    });
    const second = mergeContents({
      src: first.contents,
      newSrc: 'generated line',
      tag: 'test-tag',
      anchor: /anchor/,
      offset: 1,
      comment: '//',
    });

    expect(second).toEqual({
      contents: first.contents,
      didClear: false,
      didMerge: false,
    });
  });

  it('replaces a generated section when its contents change', () => {
    const first = mergeContents({
      src: SOURCE,
      newSrc: 'old line',
      tag: 'test-tag',
      anchor: /anchor/,
      offset: 1,
      comment: '//',
    });
    const updated = mergeContents({
      src: first.contents,
      newSrc: 'new line',
      tag: 'test-tag',
      anchor: /anchor/,
      offset: 1,
      comment: '//',
    });

    expect(updated).toMatchObject({didClear: true, didMerge: true});
    expect(updated.contents).toContain('new line');
    expect(updated.contents).not.toContain('old line');
  });

  it('removes a tagged generated section', () => {
    const merged = mergeContents({
      src: SOURCE,
      newSrc: 'generated line',
      tag: 'test-tag',
      anchor: /anchor/,
      offset: 1,
      comment: '//',
    });

    expect(removeContents({src: merged.contents, tag: 'test-tag'})).toEqual({
      contents: SOURCE,
      didClear: true,
      didMerge: false,
    });
  });
});
