type SpeechCallback = (transcript: string) => void;
type ErrorCallback = (error: string) => void;

export function startSpeechRecognition(
  language: "en-PK" | "ur-PK",
  onResult: SpeechCallback,
  onError?: ErrorCallback
): { stop: () => void } {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError?.("Speech recognition is not supported in this browser.");
    return { stop: () => {} };
  }

  const recognition = new SpeechRecognition();
  recognition.lang = language;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError?.(event.error);
  };

  recognition.start();

  return {
    stop: () => {
      try { recognition.stop(); } catch {}
    },
  };
}
