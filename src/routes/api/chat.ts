import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createHabtiAI } from "@/lib/ai-gateway.server";

type ChatBody = {
  messages?: unknown;
  workspace?: "prospecting" | "travel-advisor" | "customer-service";
};

const instructions = {
  prospecting: "You are Habti Voyage's senior commercial copilot. Qualify travel and corporate-event enquiries in Morocco. Extract city, dates, budget, group size, mood, preferences, and next action. Be concise, refined, commercially useful, and never invent availability.",
  "travel-advisor": "You are Habti Voyage's luxury Morocco travel advisor. Recommend elegant, realistic activities and itineraries based on mood, city, dates, budget, group size, and preferences. Be concise, specific, and never claim live availability unless supplied.",
  "customer-service": "You are Habti Voyage's customer service copilot. Answer calmly, identify intent and urgency, suggest a clear resolution, and recommend human escalation for safety, payment disputes, or sensitive complaints.",
} as const;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatBody;
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response("Lovable AI is not configured", { status: 500 });
        }

        const workspace = body.workspace ?? "prospecting";
        const lovable = createHabtiAI(apiKey);
        const result = streamText({
          model: lovable.responses("openai/gpt-6-astra"),
          system: instructions[workspace],
          messages: await convertToModelMessages(body.messages as UIMessage[]),
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "medium",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });

        return result.toUIMessageStreamResponse({
          originalMessages: body.messages as UIMessage[],
          sendReasoning: true,
        });
      },
    },
  },
});