import { Observable, of, throwError } from 'rxjs';

import { KeyedCache, SingleCache } from './cache';
import { gatherError, gatherValues } from './test-helpers';

function createCacheFn(): () => Observable<number> {
  let i = 1;
  return jasmine.createSpy().and.callFake(() => of(i++));
}

describe('single cache', () => {
  it('should get the value', () => {
    const fn = createCacheFn();
    const cache = new SingleCache<number>(fn);
    expect(gatherValues(cache.get())).toEqual([1]);
    expect(gatherValues(cache.get())).toEqual([1]);
    expect(gatherValues(cache.get())).toEqual([1]);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should refresh the value', () => {
    const fn = createCacheFn();
    const cache = new SingleCache<number>(fn);
    expect(gatherValues(cache.get())).toEqual([1]);
    expect(gatherValues(cache.get(true))).toEqual([2]);
    expect(gatherValues(cache.get(true))).toEqual([3]);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should clear the value', () => {
    const fn = createCacheFn();
    const cache = new SingleCache<number>(fn);
    expect(gatherValues(cache.get())).toEqual([1]);
    cache.clear();
    expect(gatherValues(cache.get())).toEqual([2]);
    expect(gatherValues(cache.get())).toEqual([2]);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should not cache an error', () => {
    const fn = jasmine.createSpy().and.callFake(() => throwError('wrong'));
    const cache = new SingleCache<number>(fn);
    expect(gatherError(cache.get())).toEqual('wrong');
    expect(gatherError(cache.get())).toEqual('wrong');
    expect(gatherError(cache.get())).toEqual('wrong');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should get stale and refresh', () => {
    const fn = createCacheFn();
    const cache = new SingleCache<number>(fn);
    expect(gatherValues(cache.getStaleAndRefresh())).toEqual([1]);
    expect(gatherValues(cache.getStaleAndRefresh())).toEqual([1, 2]);
    expect(gatherValues(cache.getStaleAndRefresh())).toEqual([2, 3]);
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

function createKeyedCacheFn(): (key: string) => Observable<string> {
  let i = 1;
  return jasmine.createSpy().and.callFake((key: string) => of(`key:${key} #${i++}`));
}

describe('keyed cache', () => {
  it('should get the value', () => {
    const fn = createKeyedCacheFn();
    const cache = new KeyedCache<string>(fn);
    expect(gatherValues(cache.get('1'))).toEqual(['key:1 #1']);
    expect(gatherValues(cache.get('2'))).toEqual(['key:2 #2']);
    expect(gatherValues(cache.get('3'))).toEqual(['key:3 #3']);
    expect(gatherValues(cache.get('2'))).toEqual(['key:2 #2']);
    expect(gatherValues(cache.get('3'))).toEqual(['key:3 #3']);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should refresh the value', () => {
    const fn = createKeyedCacheFn();
    const cache = new KeyedCache<string>(fn);
    expect(gatherValues(cache.get('1', true))).toEqual(['key:1 #1']);
    expect(gatherValues(cache.get('2', true))).toEqual(['key:2 #2']);
    expect(gatherValues(cache.get('3', true))).toEqual(['key:3 #3']);
    expect(gatherValues(cache.get('2', true))).toEqual(['key:2 #4']);
    expect(gatherValues(cache.get('3', true))).toEqual(['key:3 #5']);
    expect(fn).toHaveBeenCalledTimes(5);
  });

  it('should clear the value', () => {
    const fn = createKeyedCacheFn();
    const cache = new KeyedCache<string>(fn);
    expect(gatherValues(cache.get('1'))).toEqual(['key:1 #1']);
    expect(gatherValues(cache.get('2'))).toEqual(['key:2 #2']);
    expect(gatherValues(cache.get('3'))).toEqual(['key:3 #3']);
    cache.clear('2');
    expect(gatherValues(cache.get('2'))).toEqual(['key:2 #4']);
    expect(gatherValues(cache.get('3'))).toEqual(['key:3 #3']);
    expect(gatherValues(cache.get('2'))).toEqual(['key:2 #4']);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('should not cache an error', () => {
    const fn = jasmine.createSpy().and.callFake(() => throwError('wrong'));
    const cache = new KeyedCache<string>(fn);
    expect(gatherError(cache.get('1'))).toEqual('wrong');
    expect(gatherError(cache.get('2'))).toEqual('wrong');
    expect(gatherError(cache.get('3'))).toEqual('wrong');
    expect(gatherError(cache.get('2'))).toEqual('wrong');
    expect(gatherError(cache.get('3'))).toEqual('wrong');
    expect(fn).toHaveBeenCalledTimes(5);
  });

  it('should get stale and refresh', () => {
    const fn = createKeyedCacheFn();
    const cache = new KeyedCache<string>(fn);
    expect(gatherValues(cache.getStaleAndRefresh('1'))).toEqual(['key:1 #1']);
    expect(gatherValues(cache.getStaleAndRefresh('1'))).toEqual(['key:1 #1', 'key:1 #2']);
    expect(gatherValues(cache.getStaleAndRefresh('2'))).toEqual(['key:2 #3']);
    expect(gatherValues(cache.getStaleAndRefresh('2'))).toEqual(['key:2 #3', 'key:2 #4']);
    expect(gatherValues(cache.getStaleAndRefresh('2'))).toEqual(['key:2 #4', 'key:2 #5']);
    expect(gatherValues(cache.getStaleAndRefresh('3'))).toEqual(['key:3 #6']);
    expect(fn).toHaveBeenCalledTimes(6);
  });
});
