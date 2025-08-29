<template>
  <div class="otp-container">
    {{ digits }}
    <input
      v-for="(digit, i) in digits"
      :key="i"
      class="otp-input"
      v-model="digits[i]"
      maxlength="1"
      @input="onInput($event, i)"
      @keydown.backspace.prevent="onBackspace(i)"
      :placeholder="placeholder || i + 1"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, defineProps } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "" },
  length: { type: Number, default: 6 },
  placeholder: { type: String, default: "" }
});

const emit = defineEmits(["update:modelValue"]);

const digits = ref(Array(props.length).fill(""));
watch(
  () => props.modelValue,
  (val) => {
    if (val !== digits.value.join("")) {
      const chars = val.split("").slice(0, props.length);
      digits.value = Array.from({ length: props.length }, (_, i) => chars[i] || "");
    }
  },
  { immediate: true }
);
watch(digits, (newDigits) => {
  emit("update:modelValue", newDigits.join(""));
});

function onInput(e, index) {
  const val = e.target.value;
  if (val && index < props.length - 1) {
    const nextInput = document.querySelectorAll(".otp-input")[index + 1];
    nextInput?.focus();
  }
}

function onBackspace(index) {
  if (!digits.value[index] && index > 0) {
    const prevInput = document.querySelectorAll(".otp-input")[index - 1];
    prevInput?.focus();
  }
}

async function autoFillOtp(timeout = 60000) {
  if (!("OTPCredential" in window)) return;

  const controller = new AbortController();
  const signal = controller.signal;
  setTimeout(() => controller.abort(), timeout);

  try {
    const content = await navigator.credentials.get({
      otp: { transport: ["sms"] },
      signal
    });
    if (content?.code) {
      content.code.split("").forEach((c, i) => {
        if (i < props.length) digits.value[i] = c;
      });
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
