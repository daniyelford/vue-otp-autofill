import { ref , onUnmounted } from "vue";
export function useOTP(timer) {
    const otpResult = ref('');
    const errorMsg=ref('')
    const otpR=ref(null)
    let intervalId = null
    let controller = null
    const otpCreator = async () => {
        if (!("OTPCredential" in window) || !navigator.credentials?.get){
            errorMsg.value='win:'+("OTPCredential" in window)+',get'+navigator.credentials?.get;
            return;
        } 
        if(controller) controller.abort()
        controller = new AbortController()
        try {
            const otp = await navigator.credentials.get({
                otp: { transport: ["sms"] },
                signal:controller.signal,
            });
            otpR.value=otp
            if (otp?.code) {
                const code = String(otp.code).match(/\d+/)?.[0] || '';
                otpResult.value = code;
                if (intervalId){
                    clearInterval(intervalId);
                    intervalId = null
                }
            }
        } catch (err) {
            if(err.message){
                errorMsg.value=err.message
            } 
        }
    };
    const requestOTP = () =>{
        if (intervalId) clearInterval(intervalId);
        if (!otpResult.value) {
            otpCreator();
            intervalId = setInterval(() => {
                if (!otpResult.value) otpCreator();
            }, timer);
        }
    }
    onUnmounted(() => {
        if (intervalId) clearInterval(intervalId);
        if (controller) controller.abort();
    });
    return { errorMsg , otpR , otpResult , requestOTP };
}