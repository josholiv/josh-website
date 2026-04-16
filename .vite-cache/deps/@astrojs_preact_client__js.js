import {
  static_html_default
} from "./chunk-V4UUEOLZ.js";
import {
  R,
  U,
  k
} from "./chunk-EJ5P4D46.js";
import "./chunk-G3PMV62Z.js";

// node_modules/@astrojs/preact/dist/client.js
var sharedSignalMap = /* @__PURE__ */ new Map();
var client_default = (element) => async (Component, props, { default: children, ...slotted }, { client }) => {
  if (!element.hasAttribute("ssr")) return;
  for (const [key, value] of Object.entries(slotted)) {
    props[key] = k(static_html_default, { value, name: key });
  }
  let signalsRaw = element.dataset.preactSignals;
  if (signalsRaw) {
    const { signal } = await import("./signals.module-2VT4M3ZS.js");
    let signals = JSON.parse(
      element.dataset.preactSignals
    );
    for (const [propName, signalId] of Object.entries(signals)) {
      if (Array.isArray(signalId)) {
        signalId.forEach(([id, indexOrKeyInProps]) => {
          const mapValue = props[propName][indexOrKeyInProps];
          let valueOfSignal = mapValue;
          if (typeof indexOrKeyInProps !== "string") {
            valueOfSignal = mapValue[0];
            indexOrKeyInProps = mapValue[1];
          }
          if (!sharedSignalMap.has(id)) {
            const signalValue = signal(valueOfSignal);
            sharedSignalMap.set(id, signalValue);
          }
          props[propName][indexOrKeyInProps] = sharedSignalMap.get(id);
        });
      } else {
        if (!sharedSignalMap.has(signalId)) {
          const signalValue = signal(props[propName]);
          sharedSignalMap.set(signalId, signalValue);
        }
        props[propName] = sharedSignalMap.get(signalId);
      }
    }
  }
  const child = k(
    Component,
    props,
    children != null ? k(static_html_default, { value: children }) : children
  );
  if (client === "only") {
    element.innerHTML = "";
    R(child, element);
  } else {
    U(child, element);
  }
  element.addEventListener("astro:unmount", () => R(null, element), { once: true });
};
export {
  client_default as default
};
//# sourceMappingURL=@astrojs_preact_client__js.js.map
