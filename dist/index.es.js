import { ref as x, onUnmounted as b, nextTick as d, watch as h, onMounted as _, createElementBlock as v, openBlock as y, Fragment as w, renderList as k, withDirectives as I, normalizeClass as T, vModelText as A } from "vue";
function C(p) {
  const s = x("");
  let n = null, r = null;
  const l = async () => {
    if (!(!("OTPCredential" in window) || !navigator.credentials?.get)) {
      n && n.abort(), n = new AbortController();
      try {
        const o = await navigator.credentials.get({
          otp: { transport: ["sms"] },
          signal: n.signal
        });
        if (o?.code) {
          const c = String(o.code).match(/\d+/)?.[0] || "";
          s.value = c, d(() => {
            const f = document.querySelectorAll(".otp-container input");
            c.split("").slice(0, p).forEach((g, e) => {
              f[e].value = g;
            });
          }), r && (clearInterval(r), r = null);
        }
      } catch (o) {
        o.message && o.message;
      }
    }
  }, m = () => {
    r && clearInterval(r), s.value || (r = setInterval(() => {
      s.value || l();
    }, 1e3));
  };
  return b(() => {
    r && clearInterval(r), n && n.abort();
  }), { otpResult: s, requestOTP: m };
}
const E = { class: "otp-container" }, V = ["onUpdate:modelValue", "onInput", "onKeydown"], P = {
  __name: "OtpInput",
  props: {
    modelValue: { type: String, default: "" },
    length: { type: Number, default: 6 },
    reset: { type: Number, default: 0 }
  },
  emits: ["update:modelValue"],
  setup(p, { emit: s }) {
    const n = p, r = s, l = x(Array.from({ length: n.length }, (e, t) => n.modelValue[t] || "")), { otpResult: m, requestOTP: o } = C(n.length), c = (e) => {
      const t = { "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };
      return e.replace(/[۰-۹]/g, (a) => t[a]);
    }, f = (e, t) => {
      const a = c(e.target.value).replace(/[^0-9]/g, "").charAt(0) || "";
      l.value[t] = a, a && t < l.value.length - 1 && d(() => e.target.parentElement.children[t + 1].focus());
    }, g = (e, t) => {
      const a = e.currentTarget.parentElement.children;
      if (e.key === "Backspace") {
        !l.value[t] && t > 0 && d(() => a[t - 1].focus());
        return;
      }
      e.key === "ArrowLeft" && t > 0 && d(() => a[t - 1].focus()), e.key === "ArrowRight" && t < l.value.length - 1 && d(() => a[t + 1].focus());
    };
    return h(l, () => {
      r("update:modelValue", l.value.join(""));
    }, { deep: !0 }), h(m, (e) => {
      l.value = c(e).split("").slice(0, n.length), r("update:modelValue", e);
    }), h(n.reset, () => {
      l.value = x(Array.from({ length: n.length }, (e, t) => "")), o();
    }), _(() => {
      const e = document.createElement("style");
      e.textContent = `
    .otp-container { direction: ltr;display: flex; gap: 0.5rem; justify-content: space-evenly; }
    .digit-box { width: 1.5rem; height: 2rem; font-size: 1rem; text-align: center; border: 2px solid black; border-radius: 6px; }
    .bounce { animation: pulse 0.3s ease-in-out alternate; } 
      @keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
    `, document.head.appendChild(e), o();
    }), (e, t) => (y(), v("div", E, [
      (y(!0), v(w, null, k(l.value, (a, u) => I((y(), v("input", {
        key: u,
        type: "text",
        class: T(["digit-box", { bounce: a !== "" }]),
        "onUpdate:modelValue": (i) => l.value[u] = i,
        maxlength: "1",
        onInput: (i) => f(i, u),
        onKeydown: (i) => g(i, u)
      }, null, 42, V)), [
        [A, l.value[u]]
      ])), 128))
    ]));
  }
};
export {
  P as default
};
