import { cloneElement, type ReactElement } from "react";

export function createAsChildRender(element: ReactElement<object>) {
  return function applyMergedProps(props: Record<string, unknown>) {
    return cloneElement(element, props);
  };
}
