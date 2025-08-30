import { ref as m, watch as _, onMounted as k, nextTick as r, createElementBlock as c, openBlock as u, Fragment as b, renderList as T, withDirectives as A, normalizeClass as E, vModelText as V } from "vue";
const C = { class: "otp-container" }, I = ["onUpdate:modelValue", "onInput", "onKeydown"], j = {
  __name: "OtpInput",
  props: {
    modelValue: { type: String, default: "" },
    length: { type: Number, default: 6 }
  },
  emits: ["update:modelValue"],
  setup(g, { emit: h }) {
    const i = m(""), s = g, f = h, o = m(Array.from({ length: s.length }, (n, e) => s.modelValue[e] || "")), v = (n) => {
      const e = { "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };
      return n.replace(/[۰-۹]/g, (t) => e[t]);
    }, y = (n, e) => {
      const t = v(n.target.value).replace(/[^0-9]/g, "").charAt(0) || "";
      o.value[e] = t, t && e < o.value.length - 1 && r(() => n.target.parentElement.children[e + 1].focus());
    }, w = (n, e) => {
      const t = n.currentTarget.parentElement.children;
      if (n.key === "Backspace") {
        !o.value[e] && e > 0 && r(() => t[e - 1].focus());
        return;
      }
      n.key === "ArrowLeft" && e > 0 && r(() => t[e - 1].focus()), n.key === "ArrowRight" && e < o.value.length - 1 && r(() => t[e + 1].focus());
    };
    return _(o, () => {
      f("update:modelValue", o.value.join("")), i.value = o.value.join("");
    }, { deep: !0 }), k(() => {
      const n = document.createElement("style");
      if (n.textContent = `
    .otp-container { direction: ltr;display: flex; gap: 0.5rem; justify-content: space-evenly; }
    .digit-box { width: 1.5rem; height: 2rem; font-size: 1rem; text-align: center; border: 2px solid black; border-radius: 6px; }
    .bounce { animation: pulse 0.3s ease-in-out alternate; } 
      @keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
    `, document.head.appendChild(n), "OTPCredential" in window) {
        const e = new AbortController();
        navigator.credentials.get({
          otp: { transport: ["sms"] },
          signal: e.signal
        }).then((t) => {
          if (t?.code) {
            i.value = t.code;
            const l = t.code.split("").slice(0, s.length);
            o.value = l, r(() => {
              const a = document.querySelectorAll(".otp-container input");
              l.forEach((x, p) => {
                a[p] && (a[p].value = x);
              });
              const d = Math.min(l.length, s.length) - 1;
              a[d] && a[d].focus();
            });
          } else
            console.warn("OTP code not received!");
        }).catch((t) => {
          console.warn("OTP error", t.message);
        });
      }
    }), (n, e) => (u(), c("div", C, [
      (u(!0), c(b, null, T(o.value, (t, l) => A((u(), c("input", {
        key: l,
        type: "text",
        class: E(["digit-box", { bounce: t !== "" }]),
        "onUpdate:modelValue": (a) => o.value[l] = a,
        maxlength: "1",
        onInput: (a) => y(a, l),
        onKeydown: (a) => w(a, l)
      }, null, 42, I)), [
        [V, o.value[l]]
      ])), 128))
    ]));
  }
};
export {
  j as default
};
