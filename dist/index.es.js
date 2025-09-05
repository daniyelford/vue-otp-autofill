import { ref as y, nextTick as d, watch as g, onMounted as w, createElementBlock as h, openBlock as v, Fragment as _, renderList as b, withDirectives as k, normalizeClass as T, vModelText as I } from "vue";
function A(p) {
  const s = y("");
  let r = null, o = null;
  const n = async () => {
    if (!(!("OTPCredential" in window) || !navigator.credentials?.get)) {
      r && r.abort(), r = new AbortController();
      try {
        const a = await navigator.credentials.get({
          otp: { transport: ["sms"] },
          signal: r.signal
        });
        if (a?.code) {
          const c = String(a.code).match(/\d+/)?.[0] || "";
          s.value = c, d(() => {
            const m = document.querySelectorAll(".otp-container input");
            c.split("").slice(0, p).forEach((f, e) => {
              m[e].value = f;
            });
          }), o && (clearInterval(o), o = null);
        }
      } catch (a) {
        console.warn("OTP error:", a.message);
      }
    }
  };
  return { otpResult: s, requestOTP: () => {
    o && clearInterval(o), s.value || (o = setInterval(() => {
      s.value || n();
    }, 1e3));
  } };
}
const O = { class: "otp-container" }, C = ["onUpdate:modelValue", "onInput", "onKeydown"], P = {
  __name: "OtpInput",
  props: {
    modelValue: { type: String, default: "" },
    length: { type: Number, default: 6 },
    reset: { type: Number, default: 0 }
  },
  emits: ["update:modelValue"],
  setup(p, { emit: s }) {
    const r = p, o = s, n = y(Array.from({ length: r.length }, (e, t) => r.modelValue[t] || "")), { otpResult: x, requestOTP: a } = A(r.length), c = (e) => {
      const t = { "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };
      return e.replace(/[۰-۹]/g, (l) => t[l]);
    }, m = (e, t) => {
      const l = c(e.target.value).replace(/[^0-9]/g, "").charAt(0) || "";
      n.value[t] = l, l && t < n.value.length - 1 && d(() => e.target.parentElement.children[t + 1].focus());
    }, f = (e, t) => {
      const l = e.currentTarget.parentElement.children;
      if (e.key === "Backspace") {
        !n.value[t] && t > 0 && d(() => l[t - 1].focus());
        return;
      }
      e.key === "ArrowLeft" && t > 0 && d(() => l[t - 1].focus()), e.key === "ArrowRight" && t < n.value.length - 1 && d(() => l[t + 1].focus());
    };
    return g(n, () => {
      o("update:modelValue", n.value.join(""));
    }, { deep: !0 }), g(x, (e) => {
      n.value = c(e).split("").slice(0, r.length), o("update:modelValue", e);
    }), g(r.reset, () => {
      n.value = y(Array.from({ length: r.length }, (e, t) => "")), a();
    }), w(() => {
      const e = document.createElement("style");
      e.textContent = `
    .otp-container { direction: ltr;display: flex; gap: 0.5rem; justify-content: space-evenly; }
    .digit-box { width: 1.5rem; height: 2rem; font-size: 1rem; text-align: center; border: 2px solid black; border-radius: 6px; }
    .bounce { animation: pulse 0.3s ease-in-out alternate; } 
      @keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
    `, document.head.appendChild(e), a();
    }), (e, t) => (v(), h("div", O, [
      (v(!0), h(_, null, b(n.value, (l, u) => k((v(), h("input", {
        key: u,
        type: "text",
        class: T(["digit-box", { bounce: l !== "" }]),
        "onUpdate:modelValue": (i) => n.value[u] = i,
        maxlength: "1",
        onInput: (i) => m(i, u),
        onKeydown: (i) => f(i, u)
      }, null, 42, C)), [
        [I, n.value[u]]
      ])), 128))
    ]));
  }
};
export {
  P as default
};
