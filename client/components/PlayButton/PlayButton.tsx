import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef } from 'react';
import animationData from '@/assets/lottie/voice.json';

interface PlayButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

export const PlayButton = ({ isRecording, onClick }: PlayButtonProps) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (isRecording) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [isRecording]);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={true}
      autoplay={false}
      style={{ width: 120, height: 120 }}
      onClick={onClick}
    />
  );
};
