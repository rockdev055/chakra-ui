import { selectors } from "./pseudo";
import { memoizeOne, Dict, isObject } from "@chakra-ui/utils";

type SelectorProp = keyof typeof selectors;

const hasUnderscore = (str: string) => str.startsWith("_");
const stripUnderscore = (str: string) => str.slice(1, str.length);

export const replacePseudoProp = memoizeOne((prop: string) => {
  if (hasUnderscore(prop)) {
    const newProp = stripUnderscore(prop);
    return selectors[newProp as SelectorProp];
  }
  return prop;
});

export const replacePseudo = (props: any) => {
  const next: Dict = {};
  for (const prop in props) {
    const propValue = props[prop];
    const propKey = replacePseudoProp(prop);
    if (isObject(propValue)) {
      next[propKey] = replacePseudo(propValue);
    } else {
      next[propKey] = propValue;
    }
  }
  return next;
};
