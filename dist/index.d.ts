// dist/index.d.ts
import { DefineComponent } from "vue";

interface OtpInputProps {
  /**
   * v-model برای bind کردن کد وارد شده
   */
  modelValue?: string;

  /**
   * طول کد (تعداد کاراکترها)
   */
  length?: number;

  /**
   * Placeholder پیش‌فرض برای input
   */
  placeholder?: string;
}

declare const OtpInput: DefineComponent<OtpInputProps>;

export default OtpInput;
