import { ref as v, onUnmounted as E, watch as k, nextTick as i, onMounted as M, createElementBlock as u, openBlock as d, Fragment as x, createCommentVNode as _, createElementVNode as O, unref as m, normalizeClass as w, toDisplayString as C, renderList as S } from "vue";
function A(h) {
  const s = v(""), n = v(""), p = v(null);
  let a = null, o = null;
  const c = async () => {
    if (!("OTPCredential" in window) || !navigator.credentials?.get) {
      n.value = "win:" + ("OTPCredential" in window) + ",get" + navigator.credentials?.get;
      return;
    }
    o && o.abort(), o = new AbortController();
    try {
      const l = await navigator.credentials.get({
        otp: { transport: ["sms"] },
        signal: o.signal
      });
      if (p.value = l, l?.code) {
        const f = String(l.code).match(/\d+/)?.[0] || "";
        s.value = f, a && (clearInterval(a), a = null);
      }
    } catch (l) {
      l.message && (n.value = l.message);
    }
  }, g = () => {
    a && clearInterval(a), s.value || (c(), a = setInterval(() => {
      s.value || c();
    }, h));
  };
  return E(() => {
    a && clearInterval(a), o && o.abort();
  }), { errorMsg: n, otpR: p, otpResult: s, requestOTP: g };
}
const N = { class: "otp-container" }, P = ["value", "onInput", "onKeydown"], V = {
  __name: "OtpInput",
  props: {
    modelValue: { type: String, default: "" },
    css: { type: String, default: "" },
    length: { type: Number, default: 6 },
    timer: { type: Number, default: 16e3 },
    reset: { type: Number, default: 0 },
    fakeCode: { type: String, default: "123456" },
    production: { type: Boolean, default: !0 }
  },
  emits: ["update:modelValue"],
  setup(h, { emit: s }) {
    const n = h, p = s, a = v(Array.from({ length: n.length }, (e, t) => n.modelValue[t] || "")), { errorMsg: o, otpR: c, otpResult: g, requestOTP: l } = A(n.timer), f = (e) => {
      const t = { "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };
      return e.replace(/[۰-۹]/g, (r) => t[r]);
    }, I = (e, t) => {
      const r = f(e.target.value).replace(/[^0-9]/g, "").charAt(0) || "";
      a.value[t] = r, r && t < a.value.length - 1 && i(() => e.target.parentElement.children[t + 1].focus());
    }, T = (e, t) => {
      const r = e.currentTarget.parentElement.children;
      if (e.key === "Backspace") {
        !a.value[t] && t > 0 && i(() => r[t - 1].focus());
        return;
      }
      e.key === "ArrowLeft" && t > 0 && i(() => r[t - 1].focus()), e.key === "ArrowRight" && t < a.value.length - 1 && i(() => r[t + 1].focus());
    };
    return k(a, (e) => {
      n.production || console.log(e), p("update:modelValue", e.join(""));
    }, { deep: !0 }), k(g, (e) => {
      const t = f(e).split("").slice(0, n.length);
      i(() => {
        for (let r = 0; r < n.length; r++)
          a.value[r] = t[r] || "";
      });
    }), k(n.reset, () => {
      i(() => {
        for (let e = 0; e < n.length; e++)
          a.value[e] = "";
        g.value = "", l();
      });
    }), M(() => {
      const e = document.createElement("style");
      if (e.textContent = n.css && n.css.trim().length > 0 ? n.css : `
    .hideMassages { display:none; }
    .otp-container { direction: ltr;display: flex; gap: 0.5rem; justify-content: space-evenly; }
    .digit-box { width: 1.5rem; height: 2rem; font-size: 1rem; text-align: center; border: 2px solid black; border-radius: 6px; }
    .bounce { animation: pulse 0.3s ease-in-out alternate; } 
      @keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
    `, document.head.appendChild(e), !n.production) {
        const t = navigator.credentials.get?.bind(navigator.credentials);
        navigator.credentials.get = async (r) => r?.otp ? { code: String(n.fakeCode) } : t ? t(r) : null;
      }
      l();
    }), (e, t) => (d(), u(x, null, [
      m(o) ? (d(), u("div", {
        key: 0,
        class: w(n.production ? "hideMassages" : "")
      }, C(m(o)), 3)) : _("", !0),
      m(c) ? (d(), u("div", {
        key: 1,
        class: w(n.production ? "hideMassages" : "")
      }, C(m(c)), 3)) : _("", !0),
      O("div", N, [
        (d(!0), u(x, null, S(a.value, (r, y) => (d(), u("input", {
          key: y,
          type: "text",
          class: w(["digit-box", { bounce: r !== "" }]),
          value: r,
          maxlength: "1",
          onInput: (b) => I(b, y),
          onKeydown: (b) => T(b, y)
        }, null, 42, P))), 128))
      ])
    ], 64));
  }
};
export {
  V as default
};
