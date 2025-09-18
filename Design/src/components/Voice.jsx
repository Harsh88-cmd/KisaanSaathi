// src/components/Voice.jsx
import { useRef, useEffect } from "react";

export default function useVoiceInput(callback) {
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = () => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      alert("Speech Recognition API not supported in this browser.");
      return;
    }

    const recognition =
      new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "hi-IN"; // or "en-IN" for English
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (callback) callback(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event) =>
      console.error("Speech recognition error:", event.error);

    recognition.onend = () => console.log("Speech recognition ended");

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  return { startListening, stopListening };
}
