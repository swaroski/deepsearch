/*
import { NextResponse } from "next/server";
import { generateObject } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from "zod";


const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || "",
  });

const clarifyResearchGoals = async (topic: string) => {

    const prompt = `
    Given the research topic <topic>${topic}</topic>, generate 2-4 clarifying questions to help narrow down the research scope. Focus on identifying:
    - Specific aspects of interest
    - Required depth/complexity level
    - Any particular perspective or excluded sources
    `

    try{
        const { object } = await generateObject({
            model: openrouter("meta-llama/llama-3.3-70b-instruct"),
            prompt,
            schema: z.object({
                questions: z.array(z.string())
            })
          });

          return object.questions;
    }catch(error){
    console.log("Error while generating questions: ", error)

    }
}


export async function POST(req: Request){

    const {topic} = await req.json();
    console.log("Topic: ", topic);

    try{
           const questions = await clarifyResearchGoals(topic);
           console.log("Questions: ", questions)

           return NextResponse.json(questions)
    }catch(error){

       console.error("Error while generating questions: ", error)
        return NextResponse.json({
            success: false, error: "Failed to generate questions"
        }, {status: 500})

    }


   
}
*/ 



import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

// ✅ Ensure API key is present
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  throw new Error("OPENROUTER_API_KEY is not defined in the environment variables.");
}

const openrouter = createOpenRouter({
  apiKey: OPENROUTER_API_KEY,
});

const clarifyResearchGoals = async (topic: string): Promise<string[]> => {
  const prompt = `
  Given the research topic <topic>${topic}</topic>, generate 2-4 clarifying questions to help narrow down the research scope. Focus on identifying:
  - Specific aspects of interest
  - Required depth/complexity level
  - Any particular perspective or excluded sources
  `;

  try {
    const { object } = await generateObject({
      model: openrouter("meta-llama/llama-3.3-70b-instruct"),
      prompt,
      schema: z.object({
        questions: z.array(z.string()),
      }),
    });

    return object.questions;
  } catch (error) {
    console.error("Error while generating questions:", error);
    throw new Error("Failed to generate questions from OpenRouter.");
  }
};

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid topic." },
        { status: 400 }
      );
    }

    console.log("Topic received:", topic);

    const questions = await clarifyResearchGoals(topic);

    console.log("Questions generated:", questions);

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("POST /api/generate-questions failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate questions." },
      { status: 500 }
    );
  }
}
