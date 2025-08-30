import { ref as g, watch as y, onMounted as v, createElementBlock as u, openBlock as i, Fragment as w, renderList as k, withDirectives as x, normalizeClass as b, vModelText as _, nextTick as s } from "vue";
const A = { class: "otp-container" }, T = ["onUpdate:modelValue", "placeholder", "onKeydown"], D = `
  .otp-container { direction: ltr;display: flex; gap: 0.5rem; justify-content: center; }
  .digit-box { width: 1.5rem; height: 2rem; font-size: 1rem; text-align: center; border: 2px solid black; border-radius: 6px; }
  .bounce { animation: pulse 0.3s ease-in-out alternate; } 
    @keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
  `, C = {
  __name: "OtpInput",
  props: {
    modelValue: { type: String, default: "" },
    length: { type: Number, default: 6 }
  },
  emits: ["update:modelValue"],
  setup(d, { emit: p }) {
    const c = d, f = p, o = g(Array.from({ length: c.length }, (e, t) => c.modelValue[t] || "")), m = (e, t) => {
      const r = e.currentTarget.parentElement.children, n = /^[0-9]$/.test(e.key);
      if (!n && !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
        e.preventDefault();
        return;
      }
      if (n) {
        o.value[t] = e.key, e.preventDefault(), t < o.value.length - 1 && s(() => r[t + 1].focus());
        return;
      }
      if (e.key === "Backspace") {
        o.value[t] = "", e.preventDefault(), t > 0 && s(() => r[t - 1].focus());
        return;
      }
      e.key === "ArrowLeft" && t > 0 && s(() => r[t - 1].focus()), e.key === "ArrowRight" && t < o.value.length - 1 && s(() => r[t + 1].focus());
    };
    async function h(e = 6e4) {
      if (!("OTPCredential" in window)) return;
      const t = new AbortController(), r = t.signal;
      setTimeout(() => t.abort(), e);
      try {
        const n = await navigator.credentials.get({
          otp: { transport: ["sms"] },
          signal: r
        });
        n?.code && (n.code.split("").forEach((l, a) => {
          a < c.length && (o.value[a] = l);
        }), s(() => {
          const l = document.querySelectorAll(".otp-container input"), a = Math.min(n.code.length, c.length) - 1;
          l[a] && l[a].focus();
        }));
      } catch (n) {
        console.warn("OTP AutoFill failed:", n.message);
      }
    }
    return y(o, () => {
      f("update:modelValue", o.value.join(""));
    }, { deep: !0 }), v(() => {
      const e = document.createElement("style");
      e.textContent = D, document.head.appendChild(e), h();
    }), (e, t) => (i(), u("div", A, [
      (i(!0), u(w, null, k(o.value, (r, n) => x((i(), u("input", {
        key: n,
        type: "text",
        class: b(["digit-box", { bounce: r !== "" }]),
        "onUpdate:modelValue": (l) => o.value[n] = l,
        maxlength: "1",
        placeholder: o.value[n] ?? 0,
        onKeydown: (l) => m(l, n)
      }, null, 42, T)), [
        [_, o.value[n]]
      ])), 128))
    ]));
  }
};
export {
  C as default
};
