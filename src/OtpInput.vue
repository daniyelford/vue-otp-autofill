<template>
  <div v-if="errorMsg" :class="props.production?'hideMassages':''">{{ errorMsg }}</div>
  <div v-if="otpR" :class="props.production?'hideMassages':''">{{ otpR }}</div>
  <div class="otp-container">
    <input
      v-for="(digit, i) in digits"
      :key="i"
      type="number"
      class="digit-box"
      :class="{ bounce: digit !== '' }"
      :value="digit"
      maxlength="1"
      @input="handleInput($event, i)"
      @keydown="handleKeyDown($event, i)"
      />
  </div>
</template>
<script setup>
  import { nextTick, defineProps, defineEmits, watch, ref, onMounted } from "vue";
  import { useOTP } from "../utils/otp";
  const props = defineProps({
    modelValue: { type: String, default: "" },
    css: { type: String, default: "" },
    length: { type: Number, default: 6 },
    timer: { type: Number, default: 16000 },
    reset: { type: Number, default:0 },
    fakeCode: { type: String, default:'123456' },
    production: { type: Boolean, default:true },
  });
  const emit = defineEmits(["update:modelValue"]);
  const digits = ref(Array.from({ length: props.length }, (_, i) => props.modelValue[i] || ""));
  const { errorMsg , otpR , otpResult , requestOTP } = useOTP(props.timer);
  const persianToEnglishDigits = (str) => {
    const map = { "۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9" };
    return str.replace(/[۰-۹]/g, d => map[d]);
  };
  const handleInput = (e, i) => {
    const val = persianToEnglishDigits(e.target.value).replace(/[^0-9]/g, "").charAt(0) || "";
    digits.value[i] = val;
    if (val && i < digits.value.length - 1) {
      nextTick(() => e.target.parentElement.children[i + 1].focus());
    }
  };
  const handleKeyDown = (e, i) => {
    const inputs = e.currentTarget.parentElement.children;
    if (e.key === "Backspace") {
      if (!digits.value[i] && i > 0) {
        nextTick(() => inputs[i - 1].focus());
      }
      return;
    }
    if (e.key === "ArrowLeft" && i > 0) {
      nextTick(() => inputs[i - 1].focus());
    }
    if (e.key === "ArrowRight" && i < digits.value.length - 1) {
      nextTick(() => inputs[i + 1].focus());
    }
  };
  watch(digits, (newVal) => {
    if(!props.production){
      console.log(newVal);
    }
    emit("update:modelValue", newVal.join(""));
  }, { deep: true });
  watch(otpResult, (newVal) => {
    const valDigits = persianToEnglishDigits(newVal).split("").slice(0, props.length);
    nextTick(() => {
      for (let i = 0; i < props.length; i++) {
        digits.value[i] = valDigits[i] || '';
      }
    });
  });
  watch(props.reset,()=>{
    nextTick(() => {
      for (let i = 0; i < props.length; i++) {
        digits.value[i] = '';
      }
      otpResult.value=''
      requestOTP();
    });
  })
  onMounted(() => {
    const style = document.createElement('style');
    style.textContent = props.css && props.css.trim().length > 0 ? props.css : `
    .hideMassages { display:none; }
    .otp-container { direction: ltr;display: flex; gap: 0.5rem; justify-content: space-evenly; }
    .digit-box { width: 1.5rem; height: 2rem; font-size: 1rem; text-align: center; border: 2px solid black; border-radius: 6px; }
    .bounce { animation: pulse 0.3s ease-in-out alternate; } 
      @keyframes pulse { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
    `;
    document.head.appendChild(style);
    if(!props.production){
      const originalGet = navigator.credentials.get?.bind(navigator.credentials)
      navigator.credentials.get = async (options) => {
        if (options?.otp) {
          return { code: String(props.fakeCode) }
        }
        return originalGet ? originalGet(options) : null
      }
    }
    requestOTP();
  });
</script>