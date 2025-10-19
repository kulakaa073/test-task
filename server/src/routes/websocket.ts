import type { FastifyPluginAsync } from 'fastify';
import { getEnvVar } from '../utils/getEnvVar.js';

const OPENAI_API_KEY = getEnvVar('OPENAI_API_KEY');

export const websocketRoutes: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('/audio', { websocket: true } as any, (connection: any, req) => {
    let openaiConnection: WebSocket | null = null;
    let isConnected = false;

    connection.on('message', async (message: any) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'start') {
          // Initialize OpenAI WebSocket connection
          if (!openaiConnection) {
            await initializeOpenAIConnection();
          }
        } else if (data.type === 'audio') {
          // Forward audio data to OpenAI
          if (openaiConnection && isConnected) {
            console.log(
              'Received audio data, length:',
              data.audio?.length || 0,
            );

            // Send audio data to OpenAI in the correct format
            try {
              openaiConnection.send(
                JSON.stringify({
                  type: 'input_audio_buffer.append',
                  audio: data.audio,
                }),
              );
              console.log('Audio data sent to OpenAI successfully');
            } catch (error) {
              console.error('Error sending audio to OpenAI:', error);
            }
          }
        } else if (data.type === 'stop') {
          // Stop recording and close connections
          if (openaiConnection) {
            openaiConnection.close();
            openaiConnection = null;
            isConnected = false;
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        connection.send(
          JSON.stringify({
            type: 'error',
            message: 'Failed to process message',
          }),
        );
      }
    });

    connection.on('close', () => {
      if (openaiConnection) {
        openaiConnection.close();
        openaiConnection = null;
        isConnected = false;
      }
    });

    async function initializeOpenAIConnection() {
      try {
        // Create WebSocket connection to OpenAI Realtime API
        openaiConnection = new WebSocket(
          'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
          {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              'OpenAI-Beta': 'realtime=v1',
            },
          } as any,
        );

        openaiConnection.onopen = () => {
          isConnected = true;
          console.log('Connected to OpenAI Realtime API');

          // Send session configuration
          openaiConnection!.send(
            JSON.stringify({
              type: 'session.update',
              session: {
                modalities: ['text', 'audio'],
                instructions:
                  "You are a helpful assistant. Respond to the user's voice input with helpful text responses.",
                voice: 'alloy',
                input_audio_format: 'pcm16',
                output_audio_format: 'pcm16',
                input_audio_transcription: {
                  model: 'whisper-1',
                },
                turn_detection: {
                  type: 'server_vad',
                  threshold: 0.5,
                  prefix_padding_ms: 300,
                  silence_duration_ms: 500,
                },
                tools: [],
                tool_choice: 'auto',
                temperature: 0.8,
                max_response_output_tokens: 4096,
              },
            }),
          );
        };

        openaiConnection.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('OpenAI response type:', data.type);

            if (data.type === 'session.created') {
              console.log('OpenAI session created');
              connection.send(
                JSON.stringify({
                  type: 'session_ready',
                  message: 'Ready to receive audio',
                }),
              );
            } else if (
              data.type ===
              'conversation.item.input_audio_buffer.speech_started'
            ) {
              console.log('Speech started');
              connection.send(
                JSON.stringify({
                  type: 'speech_started',
                }),
              );
            } else if (
              data.type ===
              'conversation.item.input_audio_buffer.speech_stopped'
            ) {
              console.log('Speech stopped');
              connection.send(
                JSON.stringify({
                  type: 'speech_stopped',
                }),
              );
            } else if (
              data.type === 'conversation.item.input_audio_buffer.committed'
            ) {
              console.log('Audio committed for transcription');
            } else if (
              data.type ===
              'conversation.item.input_audio_buffer.transcript.completed'
            ) {
              const transcript = data.transcript;
              console.log('Transcript:', transcript);
              connection.send(
                JSON.stringify({
                  type: 'transcript',
                  transcript: transcript,
                }),
              );
            } else if (
              data.type ===
              'conversation.item.output_audio_buffer.speech_started'
            ) {
              console.log('Assistant speech started');
            } else if (
              data.type ===
              'conversation.item.output_audio_buffer.speech_stopped'
            ) {
              console.log('Assistant speech stopped');
            } else if (
              data.type === 'conversation.item.output_audio_buffer.committed'
            ) {
              console.log('Assistant audio committed');
            } else if (
              data.type === 'conversation.item.output_audio_buffer.audio_added'
            ) {
              // Handle audio response from assistant
              if (data.audio) {
                connection.send(
                  JSON.stringify({
                    type: 'audio_response',
                    audio: data.audio,
                  }),
                );
              }
            } else if (data.type === 'conversation.item.message.content') {
              // Handle text response from assistant
              const content = data.content;
              console.log('Assistant response:', content);
              connection.send(
                JSON.stringify({
                  type: 'reply',
                  reply: content,
                }),
              );
            } else if (data.type === 'conversation.item.created') {
              console.log('Conversation item created');
            } else if (data.type === 'conversation.item.updated') {
              console.log('Conversation item updated');
            } else if (data.type === 'conversation.updated') {
              console.log('Conversation updated');
            } else if (data.type === 'error') {
              console.error('OpenAI API error:', data.error);
              connection.send(
                JSON.stringify({
                  type: 'error',
                  message: data.error.message || 'OpenAI API error',
                }),
              );
            }
          } catch (error) {
            console.error('Error parsing OpenAI message:', error);
          }
        };

        openaiConnection.onerror = (error) => {
          console.error('OpenAI WebSocket error:', error);
          isConnected = false;
          connection.send(
            JSON.stringify({
              type: 'error',
              message: 'Connection to OpenAI failed',
            }),
          );
        };

        openaiConnection.onclose = () => {
          console.log('OpenAI WebSocket connection closed');
          isConnected = false;
        };
      } catch (error) {
        console.error('Failed to initialize OpenAI connection:', error);
        connection.send(
          JSON.stringify({
            type: 'error',
            message: 'Failed to connect to OpenAI',
          }),
        );
      }
    }
  });
};
