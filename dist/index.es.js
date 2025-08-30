import { ref as d, watch as v, onMounted as y, createElementBlock as r, openBlock as s, createTextVNode as x, toDisplayString as b, Fragment as w, renderList as _, withDirectives as k, withKeys as V, normalizeClass as C, vModelText as E, nextTick as u } from "vue";
const T = { class: "otp-container" }, I = ["onUpdate:modelValue", "placeholder", "onInput", "onKeydown"], O = `
  .otp-container { direction: ltr;display: flex; gap: 0.5rem; justify-content: space-evenly; }
  .digit-box { width: 1.5rem; height: 2rem; font-size: 1rem; text-align: center; border: 2px solid black; border-radius: 6px; }
  .bounce { animation: pulse 0.3s ease-in-out alternate; } 
    @keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
  `, D = {
  __name: "OtpInput",
  props: {
    modelValue: { type: String, default: "" },
    length: { type: Number, default: 6 }
  },
  emits: ["update:modelValue"],
  setup(i, { emit: p }) {
    const m = d(""), c = i, h = p, n = d(Array.from({ length: c.length }, (a, e) => c.modelValue[e] || "")), g = (a, e) => {
      const o = a.target.value.replace(/[^0-9]/g, "");
      o && (n.value[e] = o, e < n.value.length - 1 && u(() => a.target.parentElement.children[e + 1].focus()));
    }, f = (a, e) => {
      !n.value[e] && e > 0 && u(() => a.target.parentElement.children[e - 1].focus());
    };
    return v(n, () => {
      h("update:modelValue", n.value.join(""));
    }, { deep: !0 }), y(() => {
      const a = document.createElement("style");
      a.textContent = O, document.head.appendChild(a), "OTPCredential" in window ? window.addEventListener("DOMContentLoaded", (e) => {
        const o = new AbortController();
        navigator.credentials.get({
          otp: { transport: ["sms"] },
          signal: o.signal
        }).then((t) => {
          alert(t.code), n.value = t.code.split("");
        }).catch((t) => {
          console.log(t);
        });
      }) : alert("WebOTP not supported!.");
    }), (a, e) => (s(), r("div", T, [
      x(b(m.value ?? "") + " ", 1),
      (s(!0), r(w, null, _(n.value, (o, t) => k((s(), r("input", {
        key: t,
        type: "text",
        class: C(["digit-box", { bounce: o !== "" }]),
        "onUpdate:modelValue": (l) => n.value[t] = l,
        maxlength: "1",
        placeholder: n.value[t] ?? 0,
        onInput: (l) => g(l, t),
        onKeydown: V((l) => f(l, t), ["backspace"])
      }, null, 42, I)), [
        [E, n.value[t]]
      ])), 128))
    ]));
  }
};
export {
  D as default
};
