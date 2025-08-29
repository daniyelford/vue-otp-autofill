<template>
  <div class="otp-container">
    <input
      v-for="(digit, index) in digits"
      :key="index"
      type="text"
      maxlength="1"
      class="otp-input"
      v-model="digits[index]"
      @input="onInput($event, index)"
      @keydown.backspace="onBackspace(index, $event)"
      ref="otpRefs[index]"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";

// تعداد رقم‌های OTP
const length = 6;

// digits state
const digits = reactive(Array(length).fill(""));
// refs برای کنترل فوکوس
const otpRefs = Array.from({ length }, () => ref(null));

// هندل تغییر هر input
function onInput(e, index) {
  const val = e.target.value;
  if (val && index < length - 1) {
    otpRefs[index + 1].value.focus();
  }
}

// هندل بک‌اسپیس
function onBackspace(index, e) {
  if (!digits[index] && index > 0) {
    otpRefs[index - 1].value.focus();
  }
}

// گرفتن مقدار نهایی
function getCode() {
  return digits.join("");
}

// --- Web OTP API ---
async function autoFillOtp(timeout = 60000) {
  if (!("OTPCredential" in window)) {
    console.log("Web OTP API not supported");
    return;
  }

  const controller = new AbortController();
  const signal = controller.signal;

  setTimeout(() => controller.abort(), timeout);

  try {
    const content = await navigator.credentials.get({
      otp: { transport: ["sms"] },
      signal
    });

    if (content?.code) {
      // پر کردن digits یکی یکی
      const code = content.code.split("");
      code.forEach((c, i) => {
        if (i < length) digits[i] = c;
      });
      await nextTick();
      console.log("Auto-filled OTP:", getCode());
    }
  } catch (err) {
    console.warn("OTP AutoFill failed:", err.message);
  }
}

onMounted(() => {
  autoFillOtp();
});
</script>

<style scoped>
.otp-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
.otp-input {
  width: 2rem;
  height: 2.5rem;
  text-align: center;
  font-size: 1.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
