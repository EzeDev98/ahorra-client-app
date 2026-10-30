import { sessionManager } from "@features/auth/session/sessionManager.js";
import { authApi } from "@features/auth/api/authApi.js";
import { ApiError } from "@core/http/httpClient.js";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  pendingVerification,
  RESEND_COOLDOWN_MS,
} from "@features/auth/verification/pendingVerification.js";
import FormScreen from "@shared/components/layout/FormScreen.jsx";
import Button from "@shared/components/ui/Button.jsx";
import FormError from "@shared/components/ui/FormError.jsx";
import FormField from "@shared/components/ui/FormField.jsx";
import InfoBanner from "@shared/components/ui/InfoBanner.jsx";
import PasswordField from "@shared/components/ui/PasswordField.jsx";
import TextField from "@shared/components/ui/TextField.jsx";
import TextLink from "@shared/components/ui/TextLink.jsx";
import {
  DESCRIPTION,
  GENERIC_ERROR,
  LABELS,
  SESSION_ENDED,
  TITLE,
  WRONG_CREDENTIALS,
} from "./loginContent.js";
import { UNVERIFIED_MESSAGE, validateLogin } from "./loginRules.js";
import { confirmTheme } from "@/features/settings/appearance/themeSync.js";

function problemFrom(error, username) {
  if (!(error instanceof ApiError))
    return { kind: "message", text: GENERIC_ERROR };

  if (
    !error.isNetwork &&
    !error.isRateLimited &&
    UNVERIFIED_MESSAGE.test(error.message)
  ) {
    const pending = pendingVerification.get();
    const canVerify =
      pending?.username?.toLowerCase() === username.toLowerCase();
    return { kind: "unverified", text: error.message, canVerify };
  }

  if (error.isUnauthorized) return { kind: "message", text: WRONG_CREDENTIALS };
  return { kind: "message", text: error.message };
}

export default function Login({
  welcomeTo,
  forgotPasswordTo,
  verifyEmailTo,
  homeTo,
  resolveDestination,
}) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [endedReason] = useState(sessionManager.getEndedReason);
  const [values, setValues] = useState({
    username: state?.username ?? "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [problem, setProblem] = useState(null);
  const [busy, setBusy] = useState(false);
  const [focusTick, setFocusTick] = useState(0);

  const stage = useRef(null);
  const passwordInput = useRef(null);
  const focusTarget = useRef("invalid");

  useEffect(() => {
    if (!focusTick) return;
    if (focusTarget.current === "password") passwordInput.current?.focus();
    else stage.current?.querySelector('[aria-invalid="true"]')?.focus();
  }, [focusTick]);

  const requestFocus = (target) => {
    focusTarget.current = target;
    setFocusTick((tick) => tick + 1);
  };

  const onChange = (name) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) =>
      current[name] ? { ...current, [name]: undefined } : current,
    );
    setProblem(null);
  };

  const startVerification = async (email, username) => {
    let resendAvailableAt = Date.now() + RESEND_COOLDOWN_MS;
    try {
      await authApi.resendEmailVerification({ email });
    } catch (error) {
      if (error instanceof ApiError && error.isRateLimited) {
        const seconds = /(\d+)\s*seconds?/i.exec(error.message)?.[1];
        if (seconds) resendAvailableAt = Date.now() + Number(seconds) * 1000;
      }
    }
    pendingVerification.set({ email, username, resendAvailableAt });
    navigate(verifyEmailTo, { replace: true });
  };

  const submit = async () => {
    if (busy) return;
    const found = validateLogin(values);
    if (Object.keys(found).length) {
      setErrors(found);
      requestFocus("invalid");
      return;
    }

    setErrors({});
    setProblem(null);
    setBusy(true);
    const username = values.username.trim();

    try {
      const data = await authApi.login({ username, password: values.password });
      sessionManager.start(data);
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === "EMAIL_NOT_VERIFIED" &&
        error.body?.email
      ) {
        await startVerification(error.body.email, username);
        return;
      }
      setProblem(problemFrom(error, username));
      setValues((current) => ({ ...current, password: "" }));
      requestFocus("password");
      setBusy(false);
      return;
    }

    pendingVerification.clear();
    let destination = null;
    try {
      destination = await resolveDestination();
    } catch {
      destination = null;
    }

    await Promise.race([confirmTheme(), new Promise((resolve) => setTimeout(resolve, 800))]);
    navigate(destination ?? homeTo, { replace: true });
  };

  return (
    <div ref={stage}>
      <FormScreen
        title={TITLE}
        description={DESCRIPTION}
        onBack={() => navigate(welcomeTo)}
        onSubmit={submit}
        footer={
          <>
            {problem?.kind === "message" && (
              <FormError>{problem.text}</FormError>
            )}
            {problem?.kind === "unverified" && (
              <InfoBanner
                tone="warning"
                action={
                  problem.canVerify ? (
                    <Button
                      variant="secondary"
                      onClick={() => navigate(verifyEmailTo)}
                    >
                      Verify email
                    </Button>
                  ) : null
                }
              >
                {problem.text}
              </InfoBanner>
            )}
            <Button type="submit" block busy={busy}>
              Sign in
            </Button>
          </>
        }
      >
        {SESSION_ENDED[endedReason] && (
          <InfoBanner title={SESSION_ENDED[endedReason].title}>
            {SESSION_ENDED[endedReason].text}
          </InfoBanner>
        )}
        <FormField label={LABELS.username} error={errors.username}>
          <TextField
            value={values.username}
            onChange={onChange("username")}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        </FormField>
        <FormField label={LABELS.password} error={errors.password}>
          <PasswordField
            inputRef={passwordInput}
            value={values.password}
            onChange={onChange("password")}
          />
        </FormField>
        <TextLink to={forgotPasswordTo} className="login__forgot">
          Forgot password?
        </TextLink>
      </FormScreen>
    </div>
  );
}
