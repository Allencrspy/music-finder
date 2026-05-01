import { memo } from "react";

interface WaveformProps {
  isVisible: boolean;
}

const Waveform = memo(({ isVisible }: WaveformProps) => {
  return (
    <div
      className={`now-playing-waveform ${isVisible ? "visible" : ""}`}
      aria-label="Now playing"
    >
      <span className="waveform-dot" />
      <span className="waveform-dot" />
      <span className="waveform-bar short" />
      <span className="waveform-dot" />
      <span className="waveform-bar medium" />
      <span className="waveform-bar tall" />
      <span className="waveform-dot" />
      <span className="waveform-bar medium delay" />
    </div>
  );
});

export default Waveform;
