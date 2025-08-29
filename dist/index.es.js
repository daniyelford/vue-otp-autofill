import { ref as v, watch as f, onMounted as y, createElementBlock as p, openBlock as i, createTextVNode as _, toDisplayString as w, Fragment as I, renderList as V, withDirectives as k, withKeys as A, withModifiers as O, vModelText as x } from "vue";
const S = (r, u) => {
  const o = r.__vccOpts || r;
  for (const [s, n] of u)
    o[s] = n;
  return o;
}, T = { class: "otp-container" }, b = ["onUpdate:modelValue", "onInput", "onKeydown", "placeholder"], B = {
  __name: "OtpInput",
  props: {
    modelValue: { type: String, default: "" },
    length: { type: Number, default: 6 },
    placeholder: { type: String, default: "" }
  },
  emits: ["update:modelValue"],
  setup(r, { emit: u }) {
    const o = r, s = u, n = v(Array(o.length).fill(""));
    f(
      () => o.modelValue,
      (e) => {
        if (e !== n.value.join("")) {
          const l = e.split("").slice(0, o.length);
          n.value = Array.from({ length: o.length }, (c, t) => l[t] || "");
        }
      },
      { immediate: !0 }
    ), f(n, (e) => {
      s("update:modelValue", e.join(""));
    });
    function m(e, l) {
      e.target.value && l < o.length - 1 && document.querySelectorAll(".otp-input")[l + 1]?.focus();
    }
    function h(e) {
      !n.value[e] && e > 0 && document.querySelectorAll(".otp-input")[e - 1]?.focus();
    }
    async function g(e = 6e4) {
      if (!("OTPCredential" in window)) return;
      const l = new AbortController(), c = l.signal;
      setTimeout(() => l.abort(), e);
      try {
        const t = await navigator.credentials.get({
          otp: { transport: ["sms"] },
          signal: c
        });
        t?.code && t.code.split("").forEach((a, d) => {
          d < o.length && (n.value[d] = a);
        });
      } catch (t) {
        console.warn("OTP AutoFill failed:", t.message);
      }
    }
    return y(() => {
      g();
    }), (e, l) => (i(), p("div", T, [
      _(w(n.value) + " ", 1),
      (i(!0), p(I, null, V(n.value, (c, t) => k((i(), p("input", {
        key: t,
        class: "otp-input",
        "onUpdate:modelValue": (a) => n.value[t] = a,
        maxlength: "1",
        onInput: (a) => m(a, t),
        onKeydown: A(O((a) => h(t), ["prevent"]), ["backspace"]),
        placeholder: r.placeholder || t + 1
      }, null, 40, b)), [
        [x, n.value[t]]
      ])), 128))
    ]));
  }
}, K = /* @__PURE__ */ S(B, [["__scopeId", "data-v-deaa89c5"]]);
export {
  K as default
};
