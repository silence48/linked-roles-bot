export const isEqual = (first: any, second: any): boolean => {
    if (first === second) {
      return true;
    }
    if ((first === undefined || second === undefined || first === null || second === null)
      && (first || second)) {
      return false;
    }
    const firstType = first?.constructor.name;
    const secondType = second?.constructor.name;
    if (firstType !== secondType) {
      return false;
    }
    if (firstType === 'Array') {
      if (first.length !== second.length) {
        return false;
      }
      let equal = true;
      for (let i = 0; i < first.length; i++) {
        if (!isEqual(first[i], second[i])) {
          equal = false;
          break;
        }
      }
      return equal;
    }
    if (firstType === 'Object') {
      let equal = true;
      const fKeys = Object.keys(first);
      const sKeys = Object.keys(second);
      if (fKeys.length !== sKeys.length) {
        return false;
      }
      for (let i = 0; i < fKeys.length; i++) {
        if (first[fKeys[i]] && second[fKeys[i]]) {
          if (first[fKeys[i]] === second[fKeys[i]]) {
            continue; // eslint-disable-line
          }
          if (first[fKeys[i]] && (first[fKeys[i]].constructor.name === 'Array'
            || first[fKeys[i]].constructor.name === 'Object')) {
            equal = isEqual(first[fKeys[i]], second[fKeys[i]]);
            if (!equal) {
              break;
            }
          } else if (first[fKeys[i]] !== second[fKeys[i]]) {
            equal = false;
            break;
          }
        } else if ((first[fKeys[i]] && !second[fKeys[i]]) || (!first[fKeys[i]] && second[fKeys[i]])) {
          equal = false;
          break;
        }
      }
      return equal;
    }
    return first === second;
  };