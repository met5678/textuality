import { useEffect, useRef } from 'react';

/**
 * Logs which of the given dependencies changed between renders.
 *
 * @param deps   - Array of dependency values (just like you’d pass into useEffect).
 * @param names? - Optional array of names for each dependency, for clearer logs.
 */
export function useWhyDidIRender(deps: any[], names?: Array<string | number>) {
  const prevDepsRef = useRef<any[]>([]);

  useEffect(() => {
    const prevDeps = prevDepsRef.current;
    const changes: Array<{
      name: string | number;
      before: any;
      after: any;
    }> = [];

    deps.forEach((dep, i) => {
      if (!Object.is(dep, prevDeps[i])) {
        changes.push({
          name: names?.[i] ?? i,
          before: prevDeps[i],
          after: dep,
        });
      }
    });

    if (changes.length) {
      console.groupCollapsed(
        `%c⟳ Dependencies changed`,
        'color: #1e90ff; font-weight: bold;',
      );
      changes.forEach(({ name, before, after }) => {
        console.log(
          `%c${name}:`,
          'color: #1e90ff;',
          'from',
          before,
          '→',
          after,
        );
      });
      console.groupEnd();
    }

    prevDepsRef.current = deps;
  });
}
