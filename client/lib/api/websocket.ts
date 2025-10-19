let socket: WebSocket | null = null;
let isConnected = false;
let audioContext: AudioContext | null = null;
let mediaStream: MediaStream | null = null;

type LastResponse = {
  transcript: string;
  reply: string;
};

// Simple resampling function
function resampleAudio(
  inputData: Float32Array,
  inputSampleRate: number,
  outputSampleRate: number,
): Float32Array {
  if (inputSampleRate === outputSampleRate) {
    return inputData;
  }

  const ratio = inputSampleRate / outputSampleRate;
  const outputLength = Math.floor(inputData.length / ratio);
  const outputData = new Float32Array(outputLength);

  for (let i = 0; i < outputLength; i++) {
    const index = i * ratio;
    const indexFloor = Math.floor(index);
    const indexCeil = Math.min(indexFloor + 1, inputData.length - 1);
    const fraction = index - indexFloor;

    outputData[i] =
      inputData[indexFloor] * (1 - fraction) + inputData[indexCeil] * fraction;
  }

  return outputData;
}

export const startAudioStream = async (
  onMessage: (message: LastResponse) => void,
) => {
  try {
    // Close any existing audio context first
    if (audioContext) {
      await audioContext.close();
      audioContext = null;
    }

    // Get microphone access
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    // Create audio context with default sample rate first
    audioContext = new AudioContext();

    // Check if we can set the sample rate to 24000
    if (audioContext.sampleRate !== 24000) {
      console.warn(
        `AudioContext sample rate is ${audioContext.sampleRate}, not 24000. This may affect audio quality.`,
      );
    }

    const source = audioContext.createMediaStreamSource(mediaStream);

    // Create a script processor for audio processing
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    source.connect(processor);
    processor.connect(audioContext.destination);

    // Connect to WebSocket
    socket = new WebSocket('ws://localhost:3001/audio');

    socket.onopen = () => {
      console.log('Connected to WebSocket');
      isConnected = true;

      // Start the session
      socket!.send(JSON.stringify({ type: 'start' }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'session_ready') {
          console.log('Session ready, starting audio capture');
        } else if (data.type === 'transcript') {
          console.log('Transcript received:', data.transcript);
        } else if (data.type === 'reply') {
          console.log('Reply received:', data.reply);
          onMessage({
            transcript: data.transcript || '',
            reply: data.reply,
          });
        } else if (data.type === 'error') {
          console.error('WebSocket error:', data.message);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
      isConnected = false;
      stopAudioStream();
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnected = false;
    };

    // Process audio data with throttling
    let lastAudioTime = 0;
    processor.onaudioprocess = (event) => {
      if (socket && isConnected) {
        const now = Date.now();
        // Throttle to 10 times per second (100ms intervals)
        if (now - lastAudioTime < 100) {
          return;
        }
        lastAudioTime = now;

        const inputBuffer = event.inputBuffer;
        const inputData = inputBuffer.getChannelData(0);

        // Resample to 24000 Hz if necessary
        let processedData: Float32Array;
        if (audioContext && audioContext.sampleRate !== 24000) {
          processedData = resampleAudio(
            inputData,
            audioContext.sampleRate,
            24000,
          );
        } else {
          processedData = new Float32Array(inputData);
        }

        // Convert Float32Array to Int16Array (PCM16)
        const pcm16Data = new Int16Array(processedData.length);
        for (let i = 0; i < processedData.length; i++) {
          pcm16Data[i] = Math.max(
            -32768,
            Math.min(32767, processedData[i] * 32768),
          );
        }

        // Convert to base64 for transmission
        const base64Audio = btoa(
          String.fromCharCode(
            ...new Uint8Array(pcm16Data.buffer as ArrayBuffer),
          ),
        );

        console.log('Sending audio data, length:', base64Audio.length);
        socket.send(
          JSON.stringify({
            type: 'audio',
            audio: base64Audio,
          }),
        );
      }
    };
  } catch (error) {
    console.error('Error starting audio stream:', error);
    throw error;
  }
};

export const stopAudioStream = () => {
  if (socket) {
    socket.send(JSON.stringify({ type: 'stop' }));
    socket.close();
    socket = null;
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  isConnected = false;
};
