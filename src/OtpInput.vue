<template>
  <div class="otp-container">
    {{ otpError??'' }}
    <input
      v-for="(digit, i) in digits"
      :key="i"
      type="text"
      class="digit-box"
      :class="{ bounce: digit !== '' }"
      v-model="digits[i]"
      maxlength="1"
      @input="handleInput($event, i)"
      @keydown.backspace="handleBackspace($event, i)"
      />
      <!-- @keydown="handleKeyDown($event, i)" -->
  </div>
</template>
<script setup>
  import { nextTick, defineProps, defineEmits, watch, ref, onMounted } from "vue";
  const otpError= ref('')
  const props = defineProps({
    modelValue: { type: String, default: "" },
    length: { type: Number, default: 6 },
  });
  const emit = defineEmits(["update:modelValue"]);
  const digits = ref(Array.from({ length: props.length }, (_, i) => props.modelValue[i] || ""));
  // const handleKeyDown = (e, i) => {
  //   const inputs = e.currentTarget.parentElement.children;
  //   const isDigit = /^[0-9]$/.test(e.key);
  //   if (!isDigit && !["Backspace","ArrowLeft","ArrowRight","Tab"].includes(e.key)) {
  //     e.preventDefault();
  //     return;
  //   }
  //   if (isDigit) {
  //     digits.value[i] = e.key;
  //     e.preventDefault();
  //     if (i < digits.value.length - 1) {
  //       nextTick(() => inputs[i + 1].focus());
  //     }
  //     return;
  //   }
  //   if (e.key === "Backspace") {
  //     digits.value[i] = "";
  //     e.preventDefault();
  //     if (i > 0) {
  //       nextTick(() => inputs[i - 1].focus());
  //     }
  //     return;
  //   }
  //   if (e.key === "ArrowLeft" && i > 0) {
  //     nextTick(() => inputs[i - 1].focus());
  //   }
  //   if (e.key === "ArrowRight" && i < digits.value.length - 1) {
  //     nextTick(() => inputs[i + 1].focus());
  //   }
  // };
  const handleInput = (e, i) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // فقط عدد
    if (value) {
      digits.value[i] = value;
      if (i < digits.value.length - 1) {
        nextTick(() => e.target.parentElement.children[i + 1].focus());
      }
    }
  };

  const handleBackspace = (e, i) => {
    if (!digits.value[i] && i > 0) {
      nextTick(() => e.target.parentElement.children[i - 1].focus());
    }
  };
  const css = `
  .otp-container { direction: ltr;display: flex; gap: 0.5rem; justify-content: space-evenly; }
  .digit-box { width: 1.5rem; height: 2rem; font-size: 1rem; text-align: center; border: 2px solid black; border-radius: 6px; }
  .bounce { animation: pulse 0.3s ease-in-out alternate; } 
    @keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
  `;
  // async function autoFillOtp(timeout = 60000) { 
  //   if (!("OTPCredential" in window)) return; 
  //   const controller = new AbortController();
  //   const signal = controller.signal;
  //   setTimeout(() => controller.abort(), timeout);
  //   try { 
  //     const content = await navigator.credentials.get({ 
  //       otp: { transport: ["sms"] }, signal 
  //     }); 
  //     otpError.value=content
  //     if (content?.code) { 
  //       otpError.value=content.code
  //       content.code.split("").forEach((c, i) => { 
  //         if (i < props.length) digits.value[i] = c; 
  //       }); 
  //       nextTick(() => {
  //         const inputs = document.querySelectorAll(".otp-container input");
  //         const last = Math.min(content.code.length, props.length) - 1;
  //         if (inputs[last]) inputs[last].focus();
  //       });
  //     }else{
  //       otpError.value='empty content'
  //     }
  //   } catch (err) { 
  //     otpError.value=err.message
  //     console.warn("OTP AutoFill failed:", err.message); 
  //   } 
  // }
  watch(digits, () => {
    emit("update:modelValue", digits.value.join(""));
  }, { deep: true });
  onMounted(() => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    // autoFillOtp()
    if ('OTPCredential' in window) { 
      window.addEventListener('DOMContentLoaded', e => {
        const ac = new AbortController();
        navigator.credentials.get({
          otp: { transport:['sms'] },
          signal: ac.signal
        }).then(otp => {
          alert(otp.code)
          digits.value = otp.code.split("")
        }).catch(err => {
          console.log(err)
        });
      })
    } else {
      alert('WebOTP not supported!.')
    }
  });
</script>