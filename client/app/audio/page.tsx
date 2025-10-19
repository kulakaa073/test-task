'use client';
import { Vizualizer } from '@/components/Vizualizer/Vizualizer';
import { PlayButton } from '@/components/PlayButton/PlayButton';
import { useState, useEffect } from 'react';
import { startAudioStream, stopAudioStream } from '@/lib/api/websocket';

const AudioPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        setTranscript(null);
        setReply(null);
        setIsConnected(true);

        await startAudioStream(
          ({ transcript, reply }: { transcript: string; reply: string }) => {
            if (transcript) {
              setTranscript(transcript);
            }
            if (reply) {
              setReply(reply);
            }
            console.log('Transcript:', transcript);
            console.log('Reply:', reply);
          },
        );
      } catch (error) {
        console.error('Error starting audio stream:', error);
        setIsConnected(false);
      }
    } else {
      stopAudioStream();
      setIsConnected(false);
    }

    setIsRecording((prev) => !prev);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopAudioStream();
      }
    };
  }, [isRecording]);
  return (
    <div className="flex flex-col items-center justify-center">
      <Vizualizer isRecording={isRecording} />
      <PlayButton isRecording={isRecording} onClick={toggleRecording} />
      <div className="w-full bg-[#262626] text-white rounded-xl px-4 py-3 min-h-[80px] flex flex-col items-center justify-center text-center">
        {isRecording && !isConnected && (
          <p className="text-yellow-400 text-sm italic">
            Connecting to voice service...
          </p>
        )}
        {isRecording && isConnected && !transcript && !reply && (
          <p className="text-gray-500 text-sm italic">Listening... Speak now</p>
        )}
        {transcript && (
          <p className="text-gray-400 text-sm mb-1">{transcript}</p>
        )}
        {reply && <p className="text-green-400 text-sm">{reply}</p>}
        {!isRecording && !transcript && !reply && (
          <p className="text-gray-500 text-sm italic">
            Click the microphone to start voice chat
          </p>
        )}
      </div>
    </div>
  );
};

export default AudioPage;
