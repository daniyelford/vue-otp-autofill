import { ref , nextTick } from "vue";
export function useOTP(length) {
    const otpResult = ref('');
    let controller = null , intervalId = null
    const otpCreator = async () => {
        if (!("OTPCredential" in window) || !navigator.credentials?.get) return;
        if(controller) controller.abort()
        controller = new AbortController()
        try {
            const otp = await navigator.credentials.get({
                otp: { transport: ["sms"] },
                signal:controller.signal,
            });
            if (otp?.code) {
                const code=String(otp.code)
                otpResult.value = code;
                nextTick(() => {
                    const inputs = document.querySelectorAll(".otp-container input");
                    code.split("").slice(0, length).forEach((v, i) => {
                        inputs[i].value = v;
                    });
                });
                if (intervalId){
                    clearInterval(intervalId);
                    intervalId = null
                }
            }
        } catch (err) {
            console.warn("OTP error:", err.message);
        }
    };
    const requestOTP = () =>{
        if (intervalId) clearInterval(intervalId);
        if (!otpResult.value) {
            intervalId = setInterval(() => {
                if (!otpResult.value) otpCreator();
            }, 1500);
        }
    }
    return { otpResult , requestOTP };
}