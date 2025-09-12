import { ref as m, onUnmounted as _, nextTick as g, watch as p, onMounted as k, createElementBlock as x, openBlock as b, Fragment as I, renderList as T, withDirectives as A, normalizeClass as C, vModelText as E } from "vue";
function O(f) {
  const s = m(""), l = m(""), c = m(null);
  let t = null, a = null;
  const v = async () => {
    if (!("OTPCredential" in window) || !navigator.credentials?.get) {
      l.value = "win:" + ("OTPCredential" in window) + ",get" + navigator.credentials?.get;
      return;
    }
    a && a.abort(), a = new AbortController();
    try {
      const r = await navigator.credentials.get({
        otp: { transport: ["sms"] },
        signal: a.signal
      });
      if (c.value = r, r?.code) {
        const u = String(r.code).match(/\d+/)?.[0] || "";
        s.value = u, g(() => {
          const y = document.querySelectorAll(".otp-container input");
          u.split("").slice(0, f).forEach((w, e) => {
            y[e].value = w;
          });
        }), t && (clearInterval(t), t = null);
      }
    } catch (r) {
      r.message && (l.value = r.message);
    }
  }, h = () => {
    t && clearInterval(t), s.value || (t = setInterval(() => {
      s.value || v();
    }, 19e3));
  };
  return _(() => {
    t && clearInterval(t), a && a.abort();
  }), { errorMsg: l, otpR: c, otpResult: s, requestOTP: h };
}
const V = { class: "otp-container" }, P = ["onUpdate:modelValue", "onInput", "onKeydown"], M = {
  __name: "OtpInput",
  props: {
    modelValue: { type: String, default: "" },
    length: { type: Number, default: 6 },
    reset: { type: Number, default: 0 }
  },
  emits: ["update:modelValue"],
  setup(f, { emit: s }) {
    const l = f, c = s, t = m(Array.from({ length: l.length }, (e, n) => l.modelValue[n] || "")), { errorMsg: a, otpR: v, otpResult: h, requestOTP: r } = O(l.length), u = (e) => {
      const n = { "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };
      return e.replace(/[۰-۹]/g, (o) => n[o]);
    }, y = (e, n) => {
      const o = u(e.target.value).replace(/[^0-9]/g, "").charAt(0) || "";
      t.value[n] = o, o && n < t.value.length - 1 && g(() => e.target.parentElement.children[n + 1].focus());
    }, w = (e, n) => {
      const o = e.currentTarget.parentElement.children;
      if (e.key === "Backspace") {
        !t.value[n] && n > 0 && g(() => o[n - 1].focus());
        return;
      }
      e.key === "ArrowLeft" && n > 0 && g(() => o[n - 1].focus()), e.key === "ArrowRight" && n < t.value.length - 1 && g(() => o[n + 1].focus());
    };
    return p(t, () => {
      c("update:modelValue", t.value.join(""));
    }, { deep: !0 }), p(v, (e) => {
      console.log(e);
    }), p(a, (e) => {
      console.log(e);
    }), p(h, (e) => {
      t.value = u(e).split("").slice(0, l.length), c("update:modelValue", e);
    }), p(l.reset, () => {
      t.value = m(Array.from({ length: l.length }, (e, n) => "")), r();
    }), k(() => {
      const e = document.createElement("style");
      e.textContent = `
    .otp-container { direction: ltr;display: flex; gap: 0.5rem; justify-content: space-evenly; }
    .digit-box { width: 1.5rem; height: 2rem; font-size: 1rem; text-align: center; border: 2px solid black; border-radius: 6px; }
    .bounce { animation: pulse 0.3s ease-in-out alternate; } 
      @keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
    `, document.head.appendChild(e), r();
    }), (e, n) => (b(), x("div", V, [
      (b(!0), x(I, null, T(t.value, (o, i) => A((b(), x("input", {
        key: i,
        type: "text",
        class: C(["digit-box", { bounce: o !== "" }]),
        "onUpdate:modelValue": (d) => t.value[i] = d,
        maxlength: "1",
        onInput: (d) => y(d, i),
        onKeydown: (d) => w(d, i)
      }, null, 42, P)), [
        [E, t.value[i]]
      ])), 128))
    ]));
  }
};
export {
  M as default
};
